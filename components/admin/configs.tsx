"use client";

import type { CrudConfig } from "./CrudPage";
import { cellMoney, cellPill } from "./CrudPage";
import { money, waLink, Pill } from "./ui";

const STATUSES = ["New", "Contacted", "Follow-up", "Quoted", "Confirmed", "Cancelled"];
const BOOKING_STATUSES = ["Pending", "Confirmed", "Completed", "Cancelled"];
const PAYMENT_STATUSES = ["Paid", "Partial", "Pending", "Refunded"];
const STAFF_ROLES = ["Photographer", "Videographer", "Editor", "Drone Operator", "Other"];
const SERVICE_OPTIONS = [
  "Wedding", "Pre-Wedding", "Candid & Cinematic", "Birthday", "New Born Baby", "Event Coverage", "Drone", "Photo & Video Editing", "Other",
];
const CATEGORIES = ["Wedding", "Pre-Wedding", "Birthday", "Baby", "Events", "Drone", "Before-After", "Other"];
const EVENT_COLORS: Record<string, string> = {
  Wedding: "#8d1f2d",
  "Pre-Wedding": "#c2185b",
  Birthday: "#ef6c00",
  Baby: "#7b1fa2",
  Events: "#0277bd",
  Drone: "#00695c",
  Other: "#5d4037",
};

export { EVENT_COLORS, CATEGORIES, SERVICE_OPTIONS };

/* ─────────────────────────────────────────────────────────────────────────── */
/* Enquiries                                                                  */
/* ─────────────────────────────────────────────────────────────────────────── */

export const enquiriesConfig: CrudConfig = {
  collection: "enquiries",
  title: "Enquiries",
  subtitle: "Every lead from the website, WhatsApp and calls",
  addLabel: "Add Enquiry",
  statuses: STATUSES,
  statusKey: "status",
  searchKeys: ["name", "phone", "eventType", "location", "email"],
  csv: [
    { key: "ref", label: "Ref" }, { key: "createdAt", label: "Received" }, { key: "name", label: "Name" },
    { key: "phone", label: "Phone" }, { key: "email", label: "Email" }, { key: "eventType", label: "Event Type" },
    { key: "eventDate", label: "Event Date" }, { key: "location", label: "Location" }, { key: "budget", label: "Budget/Package" },
    { key: "message", label: "Message" }, { key: "status", label: "Status" }, { key: "followUpDate", label: "Follow-up" },
    { key: "notes", label: "Notes" }, { key: "source", label: "Source" },
  ],
  defaults: { status: "New", source: "admin" },
  fields: [
    { key: "name", label: "Customer Name", type: "text", required: true },
    { key: "phone", label: "Mobile / WhatsApp", type: "tel", required: true, placeholder: "10-digit mobile" },
    { key: "email", label: "Email", type: "email" },
    { key: "eventType", label: "Event Type", type: "select", options: SERVICE_OPTIONS, required: true },
    { key: "eventDate", label: "Event Date", type: "date" },
    { key: "location", label: "Location / Venue", type: "text" },
    { key: "budget", label: "Budget / Package", type: "text", placeholder: "e.g. ₹25,000 or Premium Package" },
    { key: "status", label: "Lead Status", type: "select", options: STATUSES },
    { key: "followUpDate", label: "Follow-up Date", type: "date", hint: "Shows on dashboard when due" },
    { key: "message", label: "Message", type: "textarea", full: true },
    { key: "notes", label: "Internal Notes", type: "textarea", full: true, placeholder: "Private notes for the team" },
  ],
  columns: [
    {
      key: "name",
      label: "Customer",
      render: (r) => (
        <div>
          <div className="cellMain">{r.name}</div>
          <div className="cellSub">{r.email || r.location || r.ref || ""}</div>
        </div>
      ),
    },
    {
      key: "phone",
      label: "Contact",
      render: (r) => <span style={{ whiteSpace: "nowrap" }}>{r.phone}</span>,
    },
    { key: "eventType", label: "Event" },
    { key: "eventDate", label: "Event Date" },
    { key: "followUpDate", label: "Follow-up" },
    { key: "status", label: "Status", render: (r) => cellPill(r.status) },
    { key: "createdAt", label: "Received", render: (r) => <span className="cellSub">{new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span> },
  ],
  rowActions: (row, { templates }) => {
    const tpl = templates.find((t) => t.key === "enquiry-received");
    const text = tpl
      ? tpl.body
          .replace(/{{name}}/g, row.name)
          .replace(/{{service}}/g, row.eventType)
          .replace(/{{phone}}/g, row.phone)
          .replace(/{{studio}}/g, "A One Photo Studio")
      : `Hi ${row.name}! Thanks for your enquiry about ${row.eventType}.`;
    return (
      <>
        <a className="rowBtn wa" title="WhatsApp enquiry received" href={waLink(row.phone, text)} target="_blank" rel="noopener noreferrer">
          ✆
        </a>
        <a className="rowBtn" title="Call" href={`tel:${row.phone}`}>
          ☎
        </a>
      </>
    );
  },
};

/* ─────────────────────────────────────────────────────────────────────────── */
/* Customers                                                                  */
/* ─────────────────────────────────────────────────────────────────────────── */

export const customersConfig: CrudConfig = {
  collection: "customers",
  title: "Customers",
  subtitle: "Complete client database",
  addLabel: "Add Customer",
  searchKeys: ["name", "phone", "email", "address"],
  csv: [
    { key: "name", label: "Name" }, { key: "phone", label: "Phone" }, { key: "whatsapp", label: "WhatsApp" },
    { key: "email", label: "Email" }, { key: "address", label: "Address" }, { key: "notes", label: "Notes" }, { key: "createdAt", label: "Added" },
  ],
  fields: [
    { key: "name", label: "Name", type: "text", required: true },
    { key: "phone", label: "Phone", type: "tel", required: true },
    { key: "whatsapp", label: "WhatsApp Number", type: "tel", hint: "Leave empty if same as phone" },
    { key: "email", label: "Email", type: "email" },
    { key: "address", label: "Address", type: "text", full: true },
    { key: "notes", label: "Notes", type: "textarea", full: true },
  ],
  columns: [
    {
      key: "name",
      label: "Customer",
      render: (r) => (
        <div>
          <div className="cellMain">{r.name}</div>
          <div className="cellSub">{r.email || ""}</div>
        </div>
      ),
    },
    { key: "phone", label: "Phone" },
    { key: "address", label: "Address", render: (r) => <span className="cellSub">{r.address || "—"}</span> },
    { key: "createdAt", label: "Added", render: (r) => <span className="cellSub">{new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span> },
  ],
  rowActions: (row) => (
    <a className="rowBtn wa" title="WhatsApp" href={waLink(row.whatsapp || row.phone, `Hi ${row.name}!`)} target="_blank" rel="noopener noreferrer">
      ✆
    </a>
  ),
};

/* ─────────────────────────────────────────────────────────────────────────── */
/* Bookings                                                                   */
/* ─────────────────────────────────────────────────────────────────────────── */

export const bookingsConfig: CrudConfig = {
  collection: "bookings",
  title: "Bookings",
  subtitle: "Confirmed events with crew, amounts and balance",
  addLabel: "Add Booking",
  statuses: BOOKING_STATUSES,
  statusKey: "status",
  searchKeys: ["name", "phone", "eventType", "venue", "package"],
  extraCollections: { staff: "staff", payments: "payments", templates: "templates" },
  csv: [
    { key: "name", label: "Client" }, { key: "phone", label: "Phone" }, { key: "eventType", label: "Event" },
    { key: "eventDate", label: "Date" }, { key: "time", label: "Time" }, { key: "venue", label: "Venue" },
    { key: "package", label: "Package" }, { key: "amount", label: "Amount" }, { key: "advance", label: "Advance" },
    { key: "status", label: "Status" }, { key: "notes", label: "Notes" },
  ],
  defaults: { status: "Confirmed", amount: 0, advance: 0 },
  fields: [
    { key: "name", label: "Client Name", type: "text", required: true },
    { key: "phone", label: "Phone", type: "tel", required: true },
    { key: "eventType", label: "Event Type", type: "select", options: SERVICE_OPTIONS, required: true },
    { key: "eventDate", label: "Event Date", type: "date", required: true },
    { key: "time", label: "Event Time", type: "time" },
    { key: "venue", label: "Venue", type: "text", full: true },
    { key: "package", label: "Package", type: "text", placeholder: "Basic / Premium / Custom" },
    { key: "photographerId", label: "Photographer", type: "text", optionsFrom: { collection: "staff", label: (s) => `${s.name} (${s.role})` } },
    { key: "videographerId", label: "Videographer", type: "text", optionsFrom: { collection: "staff", label: (s) => `${s.name} (${s.role})` } },
    { key: "editorId", label: "Editor", type: "text", optionsFrom: { collection: "staff", label: (s) => `${s.name} (${s.role})` } },
    { key: "amount", label: "Booking Amount (₹)", type: "number", required: true },
    { key: "advance", label: "Advance Received (₹)", type: "number" },
    { key: "status", label: "Booking Status", type: "select", options: BOOKING_STATUSES },
    { key: "contract", label: "Contract / Details", type: "textarea", full: true, placeholder: "Deliverables, timings, special requests…" },
    { key: "notes", label: "Internal Notes", type: "textarea", full: true },
  ],
  columns: [
    {
      key: "name",
      label: "Client",
      render: (r) => (
        <div>
          <div className="cellMain">{r.name}</div>
          <div className="cellSub">{r.phone}</div>
        </div>
      ),
    },
    {
      key: "eventType",
      label: "Event",
      render: (r) => (
        <div>
          <span style={{ display: "inline-block", width: 9, height: 9, borderRadius: 3, background: EVENT_COLORS[r.eventType] || EVENT_COLORS.Other, marginRight: 6 }} />
          {r.eventType}
          <div className="cellSub">{r.eventDate}{r.time ? ` · ${r.time}` : ""}</div>
        </div>
      ),
    },
    { key: "venue", label: "Venue", render: (r) => <span className="cellSub">{r.venue || "—"}</span> },
    {
      key: "package",
      label: "Crew",
      render: (r, { extra }) => {
        const s = (id: string) => extra.staff?.find((x) => x.id === id)?.name;
        const crew = [s(r.photographerId), s(r.videographerId), s(r.editorId)].filter(Boolean);
        return <span className="cellSub">{crew.length ? crew.join(", ") : "Not assigned"}</span>;
      },
    },
    {
      key: "amount",
      label: "Amount",
      render: (r, { extra }) => {
        const paid = (extra.payments || []).filter((p) => p.bookingId === r.id && p.status === "Paid").reduce((s: number, p: any) => s + (Number(p.amount) || 0), 0);
        const remaining = Math.max((Number(r.amount) || 0) - (Number(r.advance) || 0) - paid, 0);
        return (
          <div>
            <div className="num">{money(r.amount)}</div>
            <div className="cellSub" style={{ color: remaining > 0 ? "#b3261e" : "#177245" }}>
              {remaining > 0 ? `${money(remaining)} due` : "Fully paid"}
            </div>
          </div>
        );
      },
    },
    { key: "status", label: "Status", render: (r) => cellPill(r.status) },
  ],
  rowActions: (row, { templates }) => {
    const tpl = templates.find((t) => t.key === "booking-confirmation");
    const text = tpl
      ? tpl.body
          .replace(/{{name}}/g, row.name)
          .replace(/{{date}}/g, row.eventDate)
          .replace(/{{location}}/g, row.venue || "the venue")
          .replace(/{{ref}}/g, row.id.slice(0, 8).toUpperCase())
          .replace(/{{amount}}/g, money(row.advance || 0))
          .replace(/{{studio}}/g, "A One Photo Studio")
      : `Hi ${row.name}! Your booking is confirmed for ${row.eventDate}.`;
    return (
      <a className="rowBtn wa" title="Send booking confirmation" href={waLink(row.phone, text)} target="_blank" rel="noopener noreferrer">
        ✆
      </a>
    );
  },
};

/* ─────────────────────────────────────────────────────────────────────────── */
/* Services                                                                   */
/* ─────────────────────────────────────────────────────────────────────────── */

export const servicesConfig: CrudConfig = {
  collection: "services",
  title: "Services",
  subtitle: "Controls the Services page and homepage section",
  addLabel: "Add Service",
  searchKeys: ["title", "slug", "tag"],
  defaults: { active: true, features: [], gallery: [] },
  fields: [
    { key: "title", label: "Title", type: "text", required: true, placeholder: "Wedding Photography" },
    { key: "slug", label: "URL Slug", type: "text", required: true, hint: "URL: /services/your-slug", placeholder: "wedding" },
    { key: "image", label: "Cover Image", type: "image", full: true, placeholder: "Upload cover" },
    { key: "tag", label: "Badge Tag", type: "text", placeholder: "Most Booked / Trending" },
    { key: "price", label: "Starting Price", type: "text", placeholder: "₹9,999" },
    { key: "desc", label: "Description", type: "textarea", full: true, required: true },
    { key: "features", label: "Features (includes list)", type: "tags", full: true, placeholder: "Add a feature…" },
    { key: "gallery", label: "Gallery Images", type: "images", full: true },
    { key: "active", label: "Active (visible on website)", type: "checkbox" },
    { key: "seoTitle", label: "SEO Title", type: "text", full: true },
    { key: "seoDesc", label: "SEO Description", type: "textarea", full: true },
  ],
  columns: [
    {
      key: "image",
      label: "Service",
      render: (r) => (
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {r.image ? <img src={r.image} alt="" style={{ width: 52, height: 40, objectFit: "cover", borderRadius: 8 }} /> : <span style={{ fontSize: 20, opacity: 0.4 }}>🖼</span>}
          <div>
            <div className="cellMain">{r.title}</div>
            <div className="cellSub">/services/{r.slug}</div>
          </div>
        </div>
      ),
    },
    { key: "price", label: "Price", render: (r) => <span className="num">{r.price || "—"}</span> },
    { key: "tag", label: "Tag", render: (r) => (r.tag ? <span className="pill Quoted">{r.tag}</span> : <span className="cellSub">—</span>) },
    { key: "active", label: "Status", render: (r) => <span className={`pill ${r.active ? "Confirmed" : "Cancelled"}`}>{r.active ? "Active" : "Hidden"}</span> },
  ],
};

/* ─────────────────────────────────────────────────────────────────────────── */
/* Packages                                                                   */
/* ─────────────────────────────────────────────────────────────────────────── */

export const packagesConfig: CrudConfig = {
  collection: "packages",
  title: "Packages",
  subtitle: "Pricing plans shown on the website",
  addLabel: "Add Package",
  searchKeys: ["name"],
  defaults: { active: true, featured: false, features: [], deliverables: [], addons: [] },
  fields: [
    { key: "name", label: "Package Name", type: "text", required: true, placeholder: "Premium Package" },
    { key: "price", label: "Price", type: "text", required: true, placeholder: "₹24,999" },
    { key: "discountPrice", label: "Discount Price", type: "text", placeholder: "₹19,999" },
    { key: "duration", label: "Duration", type: "text", placeholder: "Full day (10 hrs)" },
    { key: "photos", label: "Photos Count", type: "text", placeholder: "200+ edited photos" },
    { key: "videoDuration", label: "Video Duration", type: "text", placeholder: "3-5 min cinematic film" },
    { key: "features", label: "Features", type: "tags", full: true, placeholder: "Add a feature…" },
    { key: "deliverables", label: "Deliverables", type: "tags", full: true, placeholder: "Add a deliverable…" },
    { key: "addons", label: "Add-ons", type: "tags", full: true, placeholder: "Add an add-on…" },
    { key: "featured", label: "Featured (highlight as POPULAR)", type: "checkbox" },
    { key: "active", label: "Active (visible on website)", type: "checkbox" },
  ],
  columns: [
    {
      key: "name",
      label: "Package",
      render: (r) => (
        <div>
          <div className="cellMain">{r.name} {r.featured && <span className="pill Quoted">POPULAR</span>}</div>
          <div className="cellSub">{r.duration || ""}</div>
        </div>
      ),
    },
    {
      key: "price",
      label: "Price",
      render: (r) => (
        <div>
          <span className="num">{r.discountPrice || r.price}</span>
          {r.discountPrice && <div className="cellSub" style={{ textDecoration: "line-through" }}>{r.price}</div>}
        </div>
      ),
    },
    { key: "features", label: "Features", render: (r) => <span className="cellSub">{(r.features || []).length} items</span> },
    { key: "active", label: "Status", render: (r) => <span className={`pill ${r.active ? "Confirmed" : "Cancelled"}`}>{r.active ? "Active" : "Hidden"}</span> },
  ],
};

/* ─────────────────────────────────────────────────────────────────────────── */
/* Staff                                                                      */
/* ─────────────────────────────────────────────────────────────────────────── */

export const staffConfig: CrudConfig = {
  collection: "staff",
  title: "Staff",
  subtitle: "Photographers, videographers and editors you can assign to bookings",
  addLabel: "Add Staff",
  searchKeys: ["name", "role", "phone"],
  defaults: { active: true },
  fields: [
    { key: "name", label: "Name", type: "text", required: true },
    { key: "role", label: "Role", type: "select", options: STAFF_ROLES, required: true },
    { key: "phone", label: "Phone", type: "tel" },
    { key: "active", label: "Active", type: "checkbox" },
  ],
  columns: [
    {
      key: "name",
      label: "Name",
      render: (r) => (
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span className="admAvatar" style={{ width: 34, height: 34, fontSize: 12 }}>
            {String(r.name).split(" ").map((w: string) => w[0]).slice(0, 2).join("")}
          </span>
          <b>{r.name}</b>
        </div>
      ),
    },
    { key: "role", label: "Role", render: (r) => <span className="pill Quoted">{r.role}</span> },
    { key: "phone", label: "Phone" },
    { key: "active", label: "Status", render: (r) => <span className={`pill ${r.active ? "Confirmed" : "Cancelled"}`}>{r.active ? "Active" : "Inactive"}</span> },
  ],
};

/* ─────────────────────────────────────────────────────────────────────────── */
/* Testimonials                                                               */
/* ─────────────────────────────────────────────────────────────────────────── */

export const testimonialsConfig: CrudConfig = {
  collection: "testimonials",
  title: "Testimonials",
  subtitle: "Client reviews shown on the website",
  addLabel: "Add Review",
  statuses: ["Published", "Hidden", "Featured"],
  statusKey: "published",
  searchKeys: ["name", "text", "event"],
  defaults: { published: true, featured: false, rating: 5 },
  fields: [
    { key: "name", label: "Client Name", type: "text", required: true },
    { key: "event", label: "Event Type", type: "text", placeholder: "Wedding / Pre-Wedding" },
    { key: "photo", label: "Photo", type: "image", full: true },
    { key: "rating", label: "Rating", type: "stars" },
    { key: "text", label: "Review", type: "textarea", full: true, required: true },
    { key: "published", label: "Published (visible on website)", type: "checkbox" },
    { key: "featured", label: "Featured (shown first)", type: "checkbox" },
  ],
  columns: [
    {
      key: "name",
      label: "Client",
      render: (r) => (
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {r.photo ? <img src={r.photo} alt="" style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover" }} /> : <span className="admAvatar" style={{ width: 34, height: 34, fontSize: 12 }}>{String(r.name).split(" ").map((w: string) => w[0]).slice(0, 2).join("")}</span>}
          <div>
            <div className="cellMain">{r.name}</div>
            <div className="cellSub">{r.event}</div>
          </div>
        </div>
      ),
    },
    {
      key: "rating",
      label: "Rating",
      render: (r) => <span style={{ color: "#e9a820" }}>{"★".repeat(Number(r.rating) || 0)}</span>,
    },
    { key: "text", label: "Review", render: (r) => <span className="cellSub">{String(r.text || "").slice(0, 80)}…</span> },
    {
      key: "published",
      label: "Status",
      render: (r) => (
        <span className={`pill ${r.featured ? "Quoted" : r.published ? "Confirmed" : "Cancelled"}`}>
          {r.featured ? "Featured" : r.published ? "Published" : "Hidden"}
        </span>
      ),
    },
  ],
};

/* ─────────────────────────────────────────────────────────────────────────── */
/* Payments                                                                   */
/* ─────────────────────────────────────────────────────────────────────────── */

export const paymentsConfig: CrudConfig = {
  collection: "payments",
  title: "Payments",
  subtitle: "Advances, balances and receipts",
  addLabel: "Record Payment",
  statuses: PAYMENT_STATUSES,
  statusKey: "status",
  searchKeys: ["client", "txnId", "method", "bookingId"],
  extraCollections: { bookings: "bookings" },
  defaults: { status: "Paid", method: "UPI" },
  csv: [
    { key: "date", label: "Date" }, { key: "client", label: "Client" }, { key: "amount", label: "Amount" },
    { key: "method", label: "Method" }, { key: "txnId", label: "Txn ID" }, { key: "status", label: "Status" }, { key: "notes", label: "Notes" },
  ],
  fields: [
    { key: "client", label: "Client Name", type: "text", required: true },
    { key: "bookingId", label: "Linked Booking", type: "text", optionsFrom: { collection: "bookings", label: (b) => `${b.name} — ${b.eventDate} (${b.eventType})` } },
    { key: "amount", label: "Amount (₹)", type: "number", required: true },
    { key: "method", label: "Payment Method", type: "select", options: ["Cash", "UPI", "Bank Transfer", "Card", "Cheque"] },
    { key: "txnId", label: "Transaction ID", type: "text" },
    { key: "date", label: "Payment Date", type: "date", required: true },
    { key: "status", label: "Status", type: "select", options: PAYMENT_STATUSES },
    { key: "notes", label: "Notes", type: "textarea", full: true },
  ],
  columns: [
    {
      key: "client",
      label: "Client",
      render: (r, { extra }) => {
        const b = (extra.bookings || []).find((x) => x.id === r.bookingId);
        return (
          <div>
            <div className="cellMain">{r.client}</div>
            {b && <div className="cellSub">{b.eventType} · {b.eventDate}</div>}
          </div>
        );
      },
    },
    { key: "amount", label: "Amount", render: (r) => cellMoney(r.amount) },
    { key: "method", label: "Method", render: (r) => <span className="cellSub">{r.method}{r.txnId ? ` · ${r.txnId}` : ""}</span> },
    { key: "date", label: "Date" },
    { key: "status", label: "Status", render: (r) => cellPill(r.status) },
  ],
  rowActions: (row) => (
    <a className="rowBtn" title="Receipt (print)" href="#" onClick={(e) => { e.preventDefault(); printReceipt(row); }}>
      ⎙
    </a>
  ),
};

function printReceipt(p: Record<string, unknown>) {
  const w = window.open("", "_blank", "width=560,height=720");
  if (!w) return;
  w.document.write(`<html><head><title>Payment Receipt</title><style>
    body{font-family:Arial,sans-serif;padding:36px;color:#171516}
    h1{font-family:Georgia;color:#8d1f2d;margin:0 0 4px}h2{font-weight:500;margin:0 0 22px;color:#716a68;font-size:15px}
    table{border-collapse:collapse;width:100%}td{padding:9px 0;border-bottom:1px solid #eee}
    td:first-child{color:#716a68;width:40%}b{font-size:16px}
    .tot{font-size:19px;color:#177245;font-weight:800}
  </style></head><body>
    <h1>A One Photo Studio</h1><h2>Payment Receipt</h2>
    <table>
      <tr><td>Receipt Date</td><td>${new Date().toLocaleDateString("en-IN")}</td></tr>
      <tr><td>Client</td><td><b>${p.client}</b></td></tr>
      <tr><td>Amount</td><td class="tot">₹${Number(p.amount || 0).toLocaleString("en-IN")}</td></tr>
      <tr><td>Method</td><td>${p.method || "—"}</td></tr>
      <tr><td>Transaction ID</td><td>${p.txnId || "—"}</td></tr>
      <tr><td>Payment Date</td><td>${p.date || "—"}</td></tr>
      <tr><td>Status</td><td>${p.status}</td></tr>
      <tr><td>Notes</td><td>${p.notes || "—"}</td></tr>
    </table>
    <p style="margin-top:34px;color:#716a68;font-size:12px">Thank you for choosing A One Photo Studio · +91 9105501322</p>
  </body></html>`);
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 300);
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* WhatsApp templates                                                         */
/* ─────────────────────────────────────────────────────────────────────────── */

export const templatesConfig: CrudConfig = {
  collection: "templates",
  title: "WhatsApp Templates",
  subtitle: "Reusable messages with {{variables}} — used by the ✆ buttons across the admin",
  addLabel: "Add Template",
  searchKeys: ["title", "key", "body"],
  fields: [
    { key: "title", label: "Title", type: "text", required: true },
    { key: "key", label: "Template Key", type: "text", required: true, hint: "Unique id, e.g. booking-confirmation", placeholder: "my-template" },
    { key: "body", label: "Message Body", type: "textarea", full: true, required: true, hint: "Variables: {{name}} {{phone}} {{service}} {{package}} {{date}} {{location}} {{ref}} {{amount}} {{studio}} {{reviewUrl}}" },
  ],
  columns: [
    { key: "title", label: "Template", render: (r) => <div><div className="cellMain">{r.title}</div><div className="cellSub">{r.key}</div></div> },
    { key: "body", label: "Preview", render: (r) => <span className="cellSub">{String(r.body || "").slice(0, 100)}…</span> },
  ],
};

/* ─────────────────────────────────────────────────────────────────────────── */
/* Admin users (used inside Settings)                                         */
/* ─────────────────────────────────────────────────────────────────────────── */

export const adminUsersConfig: CrudConfig = {
  collection: "adminusers",
  title: "Admin Users",
  subtitle: "Team access to this dashboard",
  addLabel: "Add User",
  searchKeys: ["name", "mobile", "role"],
  extraCollections: { staff: "staff" },
  defaults: { role: "manager", active: true },
  fields: [
    { key: "name", label: "Name", type: "text", required: true },
    { key: "mobile", label: "Mobile (login id)", type: "tel", required: true, placeholder: "10-digit mobile" },
    { key: "password", label: "Password", type: "password", required: true, createOnly: true, hint: "At least 4 characters" },
    { key: "role", label: "Role", type: "select", options: ["superadmin", "manager", "photographer", "editor"], required: true },
    { key: "staffId", label: "Linked Staff (optional)", type: "text", optionsFrom: { collection: "staff", label: (s) => `${s.name} (${s.role})` }, hint: "Photographers see only bookings assigned to them" },
    { key: "active", label: "Active", type: "checkbox" },
  ],
  columns: [
    {
      key: "name",
      label: "User",
      render: (r) => (
        <div>
          <div className="cellMain">{r.name}</div>
          <div className="cellSub">{r.mobile}</div>
        </div>
      ),
    },
    { key: "role", label: "Role", render: (r) => <span className="pill New" style={{ textTransform: "capitalize" }}>{r.role}</span> },
    { key: "active", label: "Status", render: (r) => <span className={`pill ${r.active ? "Confirmed" : "Cancelled"}`}>{r.active ? "Active" : "Disabled"}</span> },
  ],
};

/* ─────────────────────────────────────────────────────────────────────────── */
/* Coupons                                                                    */
/* ─────────────────────────────────────────────────────────────────────────── */

export const couponsConfig: CrudConfig = {
  collection: "coupons",
  title: "Coupons & Offers",
  subtitle: "Discount codes to quote special prices",
  addLabel: "Add Coupon",
  searchKeys: ["code"],
  defaults: { active: true, type: "percent" },
  fields: [
    { key: "code", label: "Coupon Code", type: "text", required: true, placeholder: "WEDDING10" },
    { key: "type", label: "Discount Type", type: "select", options: ["percent", "fixed"], required: true },
    { key: "value", label: "Value (10 = 10% OR ₹10)", type: "number", required: true },
    { key: "validFrom", label: "Valid From", type: "date" },
    { key: "validTo", label: "Valid To", type: "date" },
    { key: "minBooking", label: "Minimum Booking (₹)", type: "number" },
    { key: "active", label: "Active", type: "checkbox" },
  ],
  columns: [
    { key: "code", label: "Code", render: (r) => <span className="cellMain" style={{ letterSpacing: 1 }}>{r.code}</span> },
    { key: "value", label: "Discount", render: (r) => <span className="num">{r.type === "percent" ? `${r.value}% OFF` : `₹${r.value} OFF`}</span> },
    {
      key: "validTo",
      label: "Validity",
      render: (r) => (
        <span className="cellSub">
          {r.validFrom || "—"} → {r.validTo || "no expiry"}
        </span>
      ),
    },
    { key: "minBooking", label: "Min Booking", render: (r) => (r.minBooking ? `₹${r.minBooking}` : "—") },
    { key: "active", label: "Status", render: (r) => <span className={`pill ${r.active ? "Confirmed" : "Cancelled"}`}>{r.active ? "Active" : "Inactive"}</span> },
  ],
};

export { cellMoney, cellPill, money };