"use client";

import { useEffect, useState } from "react";
import { ImageUpload } from "@/components/admin/ui";

type Content = {
  heroEyebrow: string;
  heroTitle: string;
  heroTitleAccent: string;
  heroScript: string;
  heroText: string;
  heroImage: string;
  aboutTitle: string;
  aboutText: string;
  aboutImage: string;
  contactNote: string;
};

const DEFAULTS: Content = {
  heroEyebrow: "Capture Your Moments",
  heroTitle: "A ONE",
  heroTitleAccent: "PHOTO STUDIO",
  heroScript: "We Frame Your Memories",
  heroText:
    "Professional photography & videography for weddings, pre-weddings, birthdays, new born shoots, events and cinematic stories.",
  heroImage: "/images/studio-poster.jpeg",
  aboutTitle: "A One Photo Studio",
  aboutText:
    "We specialize in wedding, pre-wedding, candid, birthday, new born, event and cinematic shoots. Our passion is to capture real emotions and turn them into beautiful memories.",
  aboutImage: "/images/studio-wall.jpeg",
  contactNote: "Book your session or talk to the studio today.",
};

/** Edit homepage copy without touching code. */
export default function ContentPage() {
  const [c, setC] = useState<Content>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/doc/content", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => setC({ ...DEFAULTS, ...(j.value || {}) }))
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    await fetch("/api/admin/doc/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: c }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const set = (k: keyof Content, v: string) => setC({ ...c, [k]: v });

  if (loading) return <div className="panel"><div className="panelBody empty">Loading…</div></div>;

  return (
    <>
      <div className="admHead">
        <div>
          <h2>Homepage Content</h2>
          <p>Changes go live on the website within a minute — no code needed</p>
        </div>
      </div>

      <div className="setGrid">
        <div className="panel">
          <div className="panelHead">
            <h3>Hero Section</h3>
          </div>
          <div className="panelBody formGrid" style={{ display: "grid" }}>
            <div className="field">
              <label>Small Line (eyebrow)</label>
              <input value={c.heroEyebrow} onChange={(e) => set("heroEyebrow", e.target.value)} />
            </div>
            <div className="field">
              <label>Script Line (cursive)</label>
              <input value={c.heroScript} onChange={(e) => set("heroScript", e.target.value)} />
            </div>
            <div className="field">
              <label>Main Title</label>
              <input value={c.heroTitle} onChange={(e) => set("heroTitle", e.target.value)} />
            </div>
            <div className="field">
              <label>Title Accent (red part)</label>
              <input value={c.heroTitleAccent} onChange={(e) => set("heroTitleAccent", e.target.value)} />
            </div>
            <div className="field full">
              <label>Hero Paragraph</label>
              <textarea value={c.heroText} onChange={(e) => set("heroText", e.target.value)} />
            </div>
            <div className="field full">
              <label>Hero Image</label>
              <ImageUpload value={c.heroImage} onChange={(url) => set("heroImage", url)} label="Upload hero image" />
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panelHead">
            <h3>About Section & CTA</h3>
          </div>
          <div className="panelBody formGrid" style={{ display: "grid" }}>
            <div className="field full">
              <label>About Heading</label>
              <input value={c.aboutTitle} onChange={(e) => set("aboutTitle", e.target.value)} />
            </div>
            <div className="field full">
              <label>About Text</label>
              <textarea value={c.aboutText} onChange={(e) => set("aboutText", e.target.value)} style={{ minHeight: 120 }} />
            </div>
            <div className="field full">
              <label>About Image</label>
              <ImageUpload value={c.aboutImage} onChange={(url) => set("aboutImage", url)} label="Upload about image" />
            </div>
            <div className="field full">
              <label>Bottom CTA Line</label>
              <input value={c.contactNote} onChange={(e) => set("contactNote", e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      <div className="saveBar">
        <div className="inner">
          {saved && <span className="saved">✓ Saved — live in ~1 minute</span>}
          <button className="admBtn primary" onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save & Publish"}
          </button>
        </div>
      </div>
    </>
  );
}
