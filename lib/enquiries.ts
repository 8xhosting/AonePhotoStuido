/**
 * Lightweight client-side enquiry store.
 * Bookings submitted on the website are saved to localStorage so the
 * /admin dashboard can list, filter and export them. When a real backend
 * is added later, only this file needs to change.
 */

export type EnquiryStatus = "New" | "Contacted" | "Booked" | "Closed";

export type Enquiry = {
  ref: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  service: string;
  pack: string;
  date: string;
  time: string;
  message: string;
  createdAt: string;
  status: EnquiryStatus;
  source?: string;
};

const KEY = "aone_enquiries";

export function generateRef(): string {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `A1-${new Date().getFullYear()}-${n}`;
}

export function getEnquiries(): Enquiry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const list = raw ? (JSON.parse(raw) as Enquiry[]) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function saveEnquiry(data: Omit<Enquiry, "ref" | "createdAt" | "status">): Enquiry {
  const enquiry: Enquiry = {
    ...data,
    ref: generateRef(),
    createdAt: new Date().toISOString(),
    status: "New",
  };
  const list = getEnquiries();
  list.unshift(enquiry);
  window.localStorage.setItem(KEY, JSON.stringify(list));
  return enquiry;
}

export function updateEnquiryStatus(ref: string, status: EnquiryStatus): void {
  const list = getEnquiries().map((e) => (e.ref === ref ? { ...e, status } : e));
  window.localStorage.setItem(KEY, JSON.stringify(list));
}

export function deleteEnquiry(ref: string): void {
  const list = getEnquiries().filter((e) => e.ref !== ref);
  window.localStorage.setItem(KEY, JSON.stringify(list));
}

export function clearEnquiries(): void {
  window.localStorage.removeItem(KEY);
}

/** Download all enquiries as a CSV file (for the admin dashboard). */
export function exportEnquiriesCsv(): void {
  const rows = getEnquiries();
  const head = ["Ref", "Name", "Phone", "Email", "Service", "Package", "Date", "Time", "Location", "Message", "Status", "Created"];
  const esc = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
  const csv = [
    head.join(","),
    ...rows.map((e) =>
      [e.ref, e.name, e.phone, e.email, e.service, e.pack, e.date, e.time, e.location, e.message, e.status, e.createdAt].map(esc).join(",")
    ),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `a-one-enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/** Build a pre-filled WhatsApp deep link from an enquiry. */
export function whatsappLink(e: Pick<Enquiry, "ref" | "name" | "phone" | "service" | "pack" | "date" | "location" | "message">): string {
  const lines = [
    `New Booking Enquiry (${e.ref})`,
    `Name: ${e.name}`,
    `Phone: ${e.phone}`,
    `Service: ${e.service}`,
    `Package: ${e.pack}`,
    e.date ? `Event Date: ${e.date}` : "",
    e.location ? `Location: ${e.location}` : "",
    e.message ? `Message: ${e.message}` : "",
  ].filter(Boolean);
  return `https://wa.me/919105501322?text=${encodeURIComponent(lines.join("\n"))}`;
}
