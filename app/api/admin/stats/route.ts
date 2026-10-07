import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getCollection } from "@/lib/db";
import type { Booking, Enquiry, Payment, Staff, Album } from "@/lib/types";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function monthKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/** GET /api/admin/stats — aggregated numbers for the dashboard and reports pages. */
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const [enquiries, bookingsRaw, payments, staff, albums] = await Promise.all([
    getCollection<Enquiry>("enquiries"),
    getCollection<Booking>("bookings"),
    getCollection<Payment>("payments"),
    getCollection<Staff>("staff"),
    getCollection<Album>("albums"),
  ]);

  // Photographers only ever see their own assignments
  let bookings = bookingsRaw;
  if (session.role === "photographer" && session.staffId) {
    bookings = bookingsRaw.filter((b) => b.photographerId === session.staffId || b.videographerId === session.staffId);
  }

  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const thisMonth = monthKey(now);

  const paidPayments = payments.filter((p) => p.status === "Paid");
  const totalRevenue = paidPayments.reduce((s, p) => s + (Number(p.amount) || 0), 0);
  const monthRevenue = paidPayments
    .filter((p) => (p.date || "").slice(0, 7) === thisMonth)
    .reduce((s, p) => s + (Number(p.amount) || 0), 0);

  const active = bookings.filter((b) => b.status === "Pending" || b.status === "Confirmed");
  const upcoming = active
    .filter((b) => b.eventDate >= today)
    .sort((a, b) => a.eventDate.localeCompare(b.eventDate));
  const todays = upcoming.filter((b) => b.eventDate === today);

  // Remaining balance per booking (amount − advance − paid payments)
  const paidByBooking = new Map<string, number>();
  for (const p of paidPayments) {
    if (p.bookingId) paidByBooking.set(p.bookingId, (paidByBooking.get(p.bookingId) || 0) + (Number(p.amount) || 0));
  }
  const outstanding = bookings
    .filter((b) => b.status !== "Cancelled")
    .map((b) => {
      const paid = (b.advance || 0) + (paidByBooking.get(b.id) || 0) - (b.advance || 0) * 0; // advance already part of amount
      const remaining = Math.max((Number(b.amount) || 0) - paid, 0);
      return { id: b.id, name: b.name, phone: b.phone, eventDate: b.eventDate, eventType: b.eventType, amount: b.amount, remaining };
    })
    .filter((b) => b.remaining > 0)
    .sort((a, b) => b.remaining - a.remaining);
  const pendingTotal = outstanding.reduce((s, b) => s + b.remaining, 0);

  // Last-6-month chart: bookings + revenue
  const chart: { month: string; label: string; bookings: number; revenue: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = monthKey(d);
    chart.push({
      month: key,
      label: `${MONTHS[d.getMonth()]}`,
      bookings: bookings.filter((b) => (b.eventDate || "").slice(0, 7) === key).length,
      revenue: paidPayments.filter((p) => (p.date || "").slice(0, 7) === key).reduce((s, p) => s + (Number(p.amount) || 0), 0),
    });
  }

  // Popularity
  const tally = (list: string[]) => {
    const m = new Map<string, number>();
    for (const v of list) if (v) m.set(v, (m.get(v) || 0) + 1);
    return [...m.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 6);
  };
  const topServices = tally(bookings.map((b) => b.eventType));
  const topPackages = tally(bookings.map((b) => b.package || "Custom").filter((x) => x !== "Custom"));

  const confirmed = bookings.filter((b) => b.status === "Confirmed" || b.status === "Completed").length;
  const conversion = enquiries.length ? Math.round((confirmed / enquiries.length) * 100) : 0;

  // Follow-ups due (up to and including today, still open)
  const followupsDue = enquiries
    .filter((e) => ["New", "Contacted", "Follow-up", "Quoted"].includes(e.status) && e.followUpDate && e.followUpDate <= today)
    .sort((a, b) => (a.followUpDate || "").localeCompare(b.followUpDate || ""));

  // Photographer performance
  const staffName = new Map(staff.map((s) => [s.id, s.name]));
  const perf = new Map<string, { name: string; bookings: number; revenue: number }>();
  for (const b of bookings) {
    const key = b.photographerId || "unassigned";
    const entry = perf.get(key) || { name: staffName.get(key) || "Unassigned", bookings: 0, revenue: 0 };
    entry.bookings += 1;
    entry.revenue += Number(b.amount) || 0;
    perf.set(key, entry);
  }

  return NextResponse.json({
    totals: {
      enquiries: enquiries.length,
      newEnquiries: enquiries.filter((e) => e.status === "New").length,
      confirmedBookings: confirmed,
      upcomingEvents: upcoming.length,
      todaysEvents: todays.length,
      pendingPayments: outstanding.length,
      pendingAmount: pendingTotal,
      totalRevenue,
      monthRevenue,
      customers: enquiries.length,
      albums: albums.length,
      photos: albums.reduce((s, a) => s + (a.photos?.length || 0), 0),
      conversion,
      cancelled: bookings.filter((b) => b.status === "Cancelled").length,
    },
    recentEnquiries: enquiries.slice(0, 6),
    upcomingBookings: upcoming.slice(0, 6),
    followupsDue: followupsDue.slice(0, 8),
    outstanding: outstanding.slice(0, 6),
    chart,
    topServices,
    topPackages,
    photographerPerf: [...perf.values()].sort((a, b) => b.revenue - a.revenue),
    staff,
  });
}
