"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { saveEnquiry, whatsappLink, type Enquiry } from "@/lib/enquiries";
import { services } from "@/data/site";

const serviceNames = services.map((s) => s.title.replace(" Photography", "").replace(" Shoot", ""));

const today = () => new Date().toISOString().slice(0, 10);

function Form() {
  const params = useSearchParams();
  const preselected = params.get("package") || "";
  // The service page passes a full title (e.g. "Wedding Photography"); map it
  // back to the short option name used in the select.
  const rawService = params.get("service") || "";
  const preService = serviceNames.find((n) => rawService.startsWith(n)) || "";
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState<Enquiry | null>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    location: "",
    service: preService,
    pack: preselected,
    date: "",
    time: "",
    message: "",
  });

  const set = (k: string, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 3) e.name = "Please enter your full name";
    if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, ""))) e.phone = "Enter a valid 10-digit mobile number";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email address";
    if (!form.service) e.service = "Select a service";
    if (form.date && form.date < today()) e.date = "Date cannot be in the past";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    const enquiry = saveEnquiry({
      name: form.name.trim(),
      phone: form.phone.replace(/\s/g, ""),
      email: form.email.trim(),
      location: form.location.trim(),
      service: form.service,
      pack: form.pack || "Custom",
      date: form.date,
      time: form.time,
      message: form.message.trim(),
    });
    setSent(enquiry);
  };

  if (sent) {
    return (
      <div className="form successPanel">
        <div className="successIcon">✓</div>
        <h3>Enquiry Received — {sent.ref}</h3>
        <p>
          Thank you, <b>{sent.name}</b>! Our team will contact you shortly on <b>{sent.phone}</b>.
        </p>
        <div className="successActions">
          <a className="btn redBtn" href={whatsappLink(sent)} target="_blank" rel="noopener noreferrer">
            Send on WhatsApp →
          </a>
          <button
            className="btn whiteBtn"
            onClick={() => {
              setSent(null);
              setForm({ name: "", phone: "", email: "", location: "", service: "", pack: "", date: "", time: "", message: "" });
            }}
          >
            New Enquiry
          </button>
        </div>
        <small className="successNote">Tapping the WhatsApp button opens chat with your enquiry details pre-filled.</small>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={submit} noValidate>
      <div className="formGrid">
        <label>
          Name *
          <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Your full name" />
          {errors.name && <em className="err">{errors.name}</em>}
        </label>
        <label>
          Phone *
          <input
            inputMode="numeric"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value.replace(/[^\d\s]/g, "").slice(0, 12))}
            placeholder="10-digit mobile number"
          />
          {errors.phone && <em className="err">{errors.phone}</em>}
        </label>
        <label>
          Email
          <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" />
          {errors.email && <em className="err">{errors.email}</em>}
        </label>
        <label>
          Event Location
          <input value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="City / venue" />
        </label>
        <label>
          Service *
          <select value={form.service} onChange={(e) => set("service", e.target.value)}>
            <option value="" disabled>
              Select service
            </option>
            {serviceNames.map((s) => (
              <option key={s}>{s}</option>
            ))}
            <option>Other</option>
          </select>
          {errors.service && <em className="err">{errors.service}</em>}
        </label>
        <label>
          Package
          <select value={form.pack} onChange={(e) => set("pack", e.target.value)}>
            <option value="">Not decided yet</option>
            <option>Basic Package</option>
            <option>Premium Package</option>
            <option>Ultimate Package</option>
            <option>Custom</option>
          </select>
        </label>
        <label>
          Event Date
          <input type="date" min={today()} value={form.date} onChange={(e) => set("date", e.target.value)} />
          {errors.date && <em className="err">{errors.date}</em>}
        </label>
        <label>
          Preferred Time
          <input type="time" value={form.time} onChange={(e) => set("time", e.target.value)} />
        </label>
        <label className="full">
          Message
          <textarea
            value={form.message}
            onChange={(e) => set("message", e.target.value)}
            placeholder="Tell us about your event and requirements"
          />
        </label>
        <button className="btn redBtn full" type="submit">
          Submit Booking Enquiry →
        </button>
      </div>
    </form>
  );
}

export default function BookingForm() {
  return (
    <Suspense fallback={<div className="form formLoading">Loading form…</div>}>
      <Form />
    </Suspense>
  );
}
