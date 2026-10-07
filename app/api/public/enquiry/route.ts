import { NextRequest, NextResponse } from "next/server";
import { addToCollection, ensureSeed, newId } from "@/lib/db";
import type { Enquiry, Notification } from "@/lib/types";

/**
 * POST /api/public/enquiry — booking form submissions from the website.
 * Public endpoint (no session) with basic validation + rate-limit-style
 * honeypot check. Creates the enquiry and an admin notification.
 */
export async function POST(req: NextRequest) {
  try {
    await ensureSeed();
    const body = (await req.json()) as Record<string, string>;

    // Honeypot field — bots fill everything, humans don't see it
    if (body.company) return NextResponse.json({ ok: true });

    const name = (body.name || "").trim();
    const phone = (body.phone || "").replace(/\D/g, "");
    if (name.length < 3 || !/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json({ error: "Please enter your name and a valid 10-digit mobile number." }, { status: 400 });
    }

    const n = Math.floor(1000 + Math.random() * 9000);
    const enquiry: Enquiry = {
      id: newId(),
      ref: `A1-${new Date().getFullYear()}-${n}`,
      createdAt: new Date().toISOString(),
      name,
      phone,
      email: (body.email || "").trim(),
      eventType: (body.service || body.eventType || "Other").trim(),
      eventDate: (body.date || "").trim(),
      location: (body.location || "").trim(),
      budget: (body.pack || "").trim(),
      message: (body.message || "").trim(),
      status: "New",
      source: "website",
    };

    await addToCollection("enquiries", enquiry);
    await addToCollection<Notification>("notifications", {
      id: newId(),
      createdAt: new Date().toISOString(),
      read: false,
      type: "enquiry",
      title: "New website enquiry",
      body: `${enquiry.name} (${enquiry.phone}) — ${enquiry.eventType}${enquiry.eventDate ? ` on ${enquiry.eventDate}` : ""}`,
      link: "/admin/enquiries",
    });

    return NextResponse.json({ ok: true, ref: enquiry.ref });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Could not save your enquiry. Please WhatsApp us instead." },
      { status: 500 }
    );
  }
}
