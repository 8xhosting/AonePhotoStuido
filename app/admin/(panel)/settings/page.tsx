"use client";

import { useEffect, useState } from "react";
import CrudPage from "@/components/admin/CrudPage";
import { adminUsersConfig } from "@/components/admin/configs";
import type { SiteSettings } from "@/lib/types";

/** Studio settings, policies and admin user management. */
export default function SettingsPage() {
  const [s, setS] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/doc/settings", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => setS(j.value))
      .catch(() => setS(null));
  }, []);

  if (!s) return <div className="panel"><div className="panelBody empty">Loading settings…</div></div>;

  const set = (k: keyof SiteSettings, v: unknown) => setS({ ...s, [k]: v } as SiteSettings);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    await fetch("/api/admin/doc/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: s }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const social = (label: string) => s.socials.find((x) => x.label === label)?.href || "";

  const setSocial = (label: string, href: string) => {
    const others = s.socials.filter((x) => x.label !== label);
    setS({ ...s, socials: href ? [...others, { label, href }] : others });
  };

  return (
    <>
      <div className="setGrid">
        <div className="panel">
          <div className="panelHead"><h3>Studio Details</h3></div>
          <div className="panelBody formGrid">
            <div className="field"><label>Studio Name</label><input value={s.studioName} onChange={(e) => set("studioName", e.target.value)} /></div>
            <div className="field"><label>Tagline</label><input value={s.tagline} onChange={(e) => set("tagline", e.target.value)} /></div>
            <div className="field"><label>Phone (display)</label><input value={s.phone} onChange={(e) => set("phone", e.target.value)} /></div>
            <div className="field"><label>WhatsApp Number (with country code)</label><input value={s.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="919105501322" /></div>
            <div className="field"><label>Email</label><input value={s.email} onChange={(e) => set("email", e.target.value)} /></div>
            <div className="field"><label>Studio Timings</label><input value={s.hours} onChange={(e) => set("hours", e.target.value)} /></div>
            <div className="field full"><label>Address</label><input value={s.address} onChange={(e) => set("address", e.target.value)} /></div>
            <div className="field"><label>GSTIN (if applicable)</label><input value={s.gstin || ""} onChange={(e) => set("gstin", e.target.value)} /></div>
            <div className="field"><label>Currency Symbol</label><input value={s.currency} onChange={(e) => set("currency", e.target.value)} /></div>
          </div>
        </div>

        <div className="panel">
          <div className="panelHead"><h3>Social & Google</h3></div>
          <div className="panelBody formGrid">
            <div className="field"><label>Instagram URL</label><input value={social("Instagram")} onChange={(e) => setSocial("Instagram", e.target.value)} /></div>
            <div className="field"><label>Facebook URL</label><input value={social("Facebook")} onChange={(e) => setSocial("Facebook", e.target.value)} /></div>
            <div className="field"><label>YouTube URL</label><input value={social("YouTube")} onChange={(e) => setSocial("YouTube", e.target.value)} /></div>
            <div className="field"><label>Google Review Link</label><input value={s.googleReviewUrl || ""} onChange={(e) => set("googleReviewUrl", e.target.value)} placeholder="https://g.page/r/…" /></div>
          </div>
        </div>

        <div className="panel">
          <div className="panelHead"><h3>Policies (shown on Contact page)</h3></div>
          <div className="panelBody formGrid">
            <div className="field full"><label>Booking Terms</label><textarea value={s.bookingTerms || ""} onChange={(e) => set("bookingTerms", e.target.value)} /></div>
            <div className="field full"><label>Privacy Policy</label><textarea value={s.privacyPolicy || ""} onChange={(e) => set("privacyPolicy", e.target.value)} /></div>
            <div className="field full"><label>Cancellation Policy</label><textarea value={s.cancellationPolicy || ""} onChange={(e) => set("cancellationPolicy", e.target.value)} /></div>
          </div>
        </div>
      </div>

      <div className="saveBar">
        <div className="inner">
          {saved && <span className="saved">✓ Saved — live in ~1 minute</span>}
          <button className="admBtn primary" onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save Settings"}
          </button>
        </div>
      </div>

      <div style={{ height: 26 }} />
      <CrudPage config={adminUsersConfig} />
    </>
  );
}
