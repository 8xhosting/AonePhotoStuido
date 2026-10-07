import { NextRequest, NextResponse } from "next/server";
import { addToCollection, getCollection, newId } from "@/lib/db";
import { getSession, hashPassword } from "@/lib/auth";
import { canAccess } from "@/lib/permissions";
import type { AdminUser, Booking, Notification, Role } from "@/lib/types";

/**
 * Generic admin CRUD: /api/admin/crud/[collection]
 * GET = list, POST = create. Row routes handle PUT/DELETE.
 * Every request re-checks the session and the role→section permission.
 */

const SECTION_OF: Record<string, string> = {
  enquiries: "enquiries",
  customers: "customers",
  bookings: "bookings",
  payments: "payments",
  staff: "team",
  services: "services",
  packages: "packages",
  albums: "portfolio",
  testimonials: "testimonials",
  coupons: "coupons",
  notifications: "notifications",
  templates: "whatsapp",
  adminusers: "settings",
};

type Row = { id: string; createdAt?: string; [k: string]: unknown };

async function guard(collection: string) {
  const session = await getSession();
  if (!session) return { error: NextResponse.json({ error: "unauthenticated" }, { status: 401 }) };
  const section = SECTION_OF[collection];
  if (!section || !canAccess(session.role, section)) {
    return { error: NextResponse.json({ error: "forbidden" }, { status: 403 }) };
  }
  return { session };
}

async function notify(n: Omit<Notification, "id" | "createdAt" | "read">) {
  try {
    await addToCollection<Notification>("notifications", {
      ...n,
      id: newId(),
      createdAt: new Date().toISOString(),
      read: false,
    });
  } catch {
    /* notifications are best-effort */
  }
}

export async function GET(_req: NextRequest, ctx: { params: Promise<{ collection: string }> }) {
  const { collection } = await ctx.params;
  const g = await guard(collection);
  if (g.error) return g.error;

  let items = await getCollection<Row>(collection as never);

  // Photographers only see bookings assigned to them
  if (collection === "bookings" && g.session!.role === "photographer" && g.session!.staffId) {
    const me = g.session!.staffId;
    items = items.filter((b) => b.photographerId === me || b.videographerId === me);
  }
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ collection: string }> }) {
  const { collection } = await ctx.params;
  const g = await guard(collection);
  if (g.error) return g.error;

  const body = (await req.json()) as Row;
  const now = new Date().toISOString();

  // ── admin users: hash the password, protect role invariants ──
  if (collection === "adminusers") {
    const { name, mobile, password, role } = body as unknown as {
      name: string; mobile: string; password?: string; role: Role;
    };
    if (!password || password.length < 4) {
      return NextResponse.json({ error: "Password must be at least 4 characters." }, { status: 400 });
    }
    const { salt, hash } = hashPassword(password);
    const user: AdminUser = {
      id: newId(),
      name: String(name || "").trim(),
      mobile: String(mobile || "").replace(/\D/g, ""),
      salt,
      passHash: hash,
      role,
      staffId: (body.staffId as string) || undefined,
      active: true,
      createdAt: now,
    };
    const created = await addToCollection("adminusers", user);
    await notify({ type: "system", title: "New admin user added", body: `${user.name} (${user.role})` });
    return NextResponse.json({ item: created });
  }

  const item: Row = {
    ...body,
    id: newId(),
    createdAt: now,
  };

  // Sensible defaults per collection
  if (collection === "enquiries" && !item.status) item.status = "New";
  if (collection === "bookings" && !item.status) item.status = "Pending";
  if (collection === "testimonials") {
    if (item.published === undefined) item.published = true;
    if (item.featured === undefined) item.featured = false;
  }
  if (collection === "albums") {
    if (item.featured === undefined) item.featured = false;
    if (!Array.isArray(item.photos)) item.photos = [];
    if (!Array.isArray(item.videos)) item.videos = [];
  }
  if (collection === "services") {
    if (item.active === undefined) item.active = true;
    if (!Array.isArray(item.features)) item.features = [];
    if (!Array.isArray(item.gallery)) item.gallery = [];
  }
  if (collection === "packages") {
    if (item.active === undefined) item.active = true;
    if (item.featured === undefined) item.featured = false;
    for (const k of ["deliverables", "features", "addons"] as const) {
      if (!Array.isArray(item[k])) item[k] = [];
    }
  }
  if (collection === "staff" && item.active === undefined) item.active = true;
  if (collection === "coupons" && item.active === undefined) item.active = true;

  const created = await addToCollection(collection as never, item as never);

  // Activity notifications
  if (collection === "bookings") {
    const b = item as unknown as Booking;
    await notify({ type: "booking", title: "New booking created", body: `${b.name} — ${b.eventType} on ${b.eventDate}`, link: "/admin/bookings" });
  }
  if (collection === "payments") {
    await notify({ type: "payment", title: "Payment recorded", body: `${item.client} — ₹${item.amount}`, link: "/admin/payments" });
  }

  return NextResponse.json({ item: created });
}
