import "server-only";
import { randomUUID } from "crypto";
import { MongoClient, Collection, Db, Binary } from "mongodb";
import type {
  AdminUser,
  Album,
  Booking,
  Coupon,
  Enquiry,
  Notification,
  Package,
  Payment,
  SEOData,
  Service,
  SiteContent,
  SiteSettings,
  Staff,
  Testimonial,
  WhatsAppTemplate,
} from "./types";

/**
 * Data layer for the admin panel — MongoDB Atlas.
 * The connection string lives in MONGODB_URI (.env.local locally,
 * Netlify environment variables in production).
 *
 * Serverless-friendly: the client is cached on globalThis so warm function
 * invocations reuse the connection pool instead of opening a new one.
 */

const DB_NAME = "aone_studio";

export type CollectionName =
  | "enquiries"
  | "customers"
  | "bookings"
  | "payments"
  | "staff"
  | "services"
  | "packages"
  | "albums"
  | "testimonials"
  | "coupons"
  | "notifications"
  | "templates"
  | "adminusers";

export type DocName = "settings" | "content" | "seo";

declare global {
  // eslint-disable-next-line no-var
  var __aoneMongo: MongoClient | undefined;
}

function getUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set — add it to .env.local (dev) or Netlify env vars (prod).");
  return uri;
}

export function client(): MongoClient {
  if (!global.__aoneMongo) {
    global.__aoneMongo = new MongoClient(getUri(), {
      maxPoolSize: 5,
      maxIdleTimeMS: 10_000,
      serverSelectionTimeoutMS: 8_000,
    });
  }
  return global.__aoneMongo;
}

export async function db(): Promise<Db> {
  return client().db(DB_NAME);
}

export async function col(name: CollectionName | "media" | "docs"): Promise<Collection> {
  return (await db()).collection(name);
}

/** Strip Mongo's _id so documents are plain JSON-safe objects for the client. */
function clean<T>(doc: Record<string, unknown> | null): T | null {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return rest as T;
}

export function newId(): string {
  return randomUUID();
}

/* -------------------------------------------------------------------------- */
/* Collection API                                                             */
/* -------------------------------------------------------------------------- */

export async function getCollection<T>(name: CollectionName): Promise<T[]> {
  const c = await col(name);
  const docs = await c.find({}).sort({ createdAt: -1, _id: 1 }).toArray();
  return docs.map((d) => clean<T>(d as Record<string, unknown>)) as T[];
}

export async function addToCollection<T extends { id: string; createdAt?: string }>(
  name: CollectionName,
  item: T
): Promise<T> {
  const c = await col(name);
  await c.insertOne({ ...item, createdAt: item.createdAt ?? new Date().toISOString() });
  return item;
}

export async function updateInCollection<T extends { id: string }>(
  name: CollectionName,
  id: string,
  patch: Partial<T>
): Promise<T | null> {
  const c = await col(name);
  delete (patch as Record<string, unknown>).id;
  const res = await c.findOneAndUpdate({ id }, { $set: patch }, { returnDocument: "after" });
  return clean<T>(res as Record<string, unknown> | null);
}

export async function deleteFromCollection(name: CollectionName, id: string): Promise<boolean> {
  const c = await col(name);
  const res = await c.deleteOne({ id });
  return res.deletedCount > 0;
}

/* -------------------------------------------------------------------------- */
/* Singleton docs (settings, content, seo) — stored in the `docs` collection   */
/* -------------------------------------------------------------------------- */

export async function getDoc<T extends object>(name: DocName, fallback: T): Promise<T> {
  try {
    const c = await col("docs");
    const doc = await c.findOne({ key: name });
    if (!doc) return fallback;
    const { _id, key, ...value } = doc as Record<string, unknown>;
    return { ...fallback, ...(value as T) };
  } catch {
    // Never break the public site if the DB hiccups — use bundled defaults.
    return fallback;
  }
}

export async function saveDoc<T extends object>(name: DocName, value: T): Promise<void> {
  const c = await col("docs");
  await c.updateOne({ key: name }, { $set: { ...value } }, { upsert: true });
}

/* -------------------------------------------------------------------------- */
/* Media (uploaded images) — kept in the `media` collection as binary          */
/* -------------------------------------------------------------------------- */

export async function putMedia(key: string, mime: string, bytes: Uint8Array): Promise<void> {
  const c = await col("media");
  await c.updateOne(
    { key },
    { $set: { key, mime, data: new Binary(bytes), createdAt: new Date().toISOString() } },
    { upsert: true }
  );
}

export async function getMedia(key: string): Promise<{ mime: string; data: Binary } | null> {
  const c = await col("media");
  const doc = (await c.findOne({ key })) as { mime: string; data: Binary } | null;
  return doc ? { mime: doc.mime, data: doc.data } : null;
}

/* -------------------------------------------------------------------------- */
/* Settings                                                                    */
/* -------------------------------------------------------------------------- */

export async function getSettings(): Promise<SiteSettings> {
  const fallback: SiteSettings = {
    sessionSecret: "",
    studioName: "A One Photo Studio",
    tagline: "We Frame Your Memories",
    phone: "+91 9105501322",
    whatsapp: "919105501322",
    email: "aonephotostudio@gmail.com",
    address: "Main Market Road, Your City, State",
    hours: "Mon - Sun · 9 AM - 8 PM",
    currency: "₹",
    socials: [
      { label: "Instagram", href: "https://instagram.com" },
      { label: "Facebook", href: "https://facebook.com" },
      { label: "YouTube", href: "https://youtube.com" },
      { label: "WhatsApp", href: "https://wa.me/919105501322" },
    ],
    googleReviewUrl: "",
    bookingTerms: "Dates are blocked with a 25% advance. Advance is non-refundable within 7 days of the event.",
    privacyPolicy: "We use your contact details only to respond to your enquiry and deliver your media. We never sell your data.",
    cancellationPolicy:
      "Cancellations more than 30 days before the event get a full refund minus the advance. Within 30 days, the advance is retained.",
  };
  const doc = await getDoc<SiteSettings>("settings", fallback);
  return doc;
}

export async function saveSettings(patch: Partial<SiteSettings>): Promise<SiteSettings> {
  const current = await getSettings();
  const next = { ...current, ...patch };
  await saveDoc("settings", next);
  return next;
}

/* -------------------------------------------------------------------------- */
/* Seeding                                                                     */
/* -------------------------------------------------------------------------- */

const DEFAULT_TEMPLATES: WhatsAppTemplate[] = [
  {
    id: "tpl-enquiry",
    key: "enquiry-received",
    title: "Enquiry Received",
    body: "Hi {{name}}! Thank you for contacting {{studio}} 🙏 We have received your enquiry for {{service}}. Our team will call you shortly on {{phone}} with availability and a quote.",
  },
  {
    id: "tpl-quote",
    key: "quotation",
    title: "Package Quotation",
    body: "Hi {{name}}! Here is the quote for {{service}} ({{date}}):\nPackage: {{package}}\nAmount: {{amount}}\n— {{studio}}. Reply YES to block your date!",
  },
  {
    id: "tpl-confirm",
    key: "booking-confirmation",
    title: "Booking Confirmation",
    body: "Hi {{name}}! 🎉 Your booking with {{studio}} is CONFIRMED for {{date}} at {{location}}. Booking ref: {{ref}}. Advance received: {{amount}}. See you there!",
  },
  {
    id: "tpl-pay-remind",
    key: "payment-reminder",
    title: "Payment Reminder",
    body: "Hi {{name}}, gentle reminder from {{studio}}: remaining balance {{amount}} for your {{date}} event (ref {{ref}}). Pay via UPI or cash on the event day — whatever is convenient!",
  },
  {
    id: "tpl-event-remind",
    key: "event-reminder",
    title: "Event Reminder",
    body: "Hi {{name}}! Excited for tomorrow 📸 Our team from {{studio}} will reach {{location}} on time for your {{service}}. Please keep the area/access ready. Call {{phone}} for anything!",
  },
  {
    id: "tpl-thanks",
    key: "thank-you",
    title: "Thank You Message",
    body: "Hi {{name}}! It was an honour capturing your {{service}} 💛 Your edited gallery will be delivered soon. If you loved our work, a Google review would mean a lot: {{reviewUrl}} — Team {{studio}}",
  },
];

/** Idempotent seed: WhatsApp templates. Super admin is created via first-run setup. */
export async function ensureSeed(): Promise<void> {
  const c = await col("templates");
  const count = await c.countDocuments();
  if (count === 0) {
    await c.insertMany(DEFAULT_TEMPLATES.map((t) => ({ ...t, createdAt: new Date().toISOString() })));
  }
}

/* Re-export entity types so server code can import them from one place */
export type {
  AdminUser,
  Album,
  Booking,
  Coupon,
  Enquiry,
  Notification,
  Package,
  Payment,
  SEOData,
  Service,
  SiteContent,
  SiteSettings,
  Staff,
  Testimonial,
  WhatsAppTemplate,
};
