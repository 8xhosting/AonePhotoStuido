"use client";

import { useEffect, useState } from "react";

type PageSEO = { title: string; description: string; keywords?: string; ogImage?: string };
type SEO = { robots: string; pages: Record<string, PageSEO> };

const PATHS = ["/", "/about", "/services", "/portfolio", "/gallery", "/packages", "/testimonials", "/contact", "/booking"];

/** Per-page SEO editor — titles, descriptions, keywords, OG image, robots. */
export default function SeoPage() {
  const [seo, setSeo] = useState<SEO>({ robots: "index", pages: {} });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/doc/seo", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => setSeo({ robots: "index", pages: {}, ...(j.value || {}) }))
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    await fetch("/api/admin/doc/seo", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: seo }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const setPage = (path: string, patch: Partial<PageSEO>) =>
    setSeo({ ...seo, pages: { ...seo.pages, [path]: { ...(seo.pages[path] || { title: "", description: "" }), ...patch } } });

  if (loading) return <div className="panel"><div className="panelBody empty">Loading…</div></div>;

  return (
    <>
      <div className="admHead">
        <div>
          <h2>SEO Management</h2>
          <p>Per-page titles and descriptions for Google — empty fields use the built-in defaults</p>
        </div>
      </div>

      <div className="panel" style={{ marginBottom: 16 }}>
        <div className="panelHead">
          <h3>Search Engine Indexing</h3>
        </div>
        <div className="panelBody">
          <div className="field" style={{ maxWidth: 280 }}>
            <label>Robots</label>
            <select value={seo.robots} onChange={(e) => setSeo({ ...seo, robots: e.target.value })}>
              <option value="index">index — allow Google to rank the site</option>
              <option value="noindex">noindex — hide from Google</option>
            </select>
          </div>
        </div>
      </div>

      {PATHS.map((p) => (
        <div className="panel" key={p}>
          <div className="panelHead">
            <h3 style={{ fontSize: 15 }}>
              {p === "/" ? "Homepage" : p} <span className="cellSub" style={{ fontWeight: 400 }}>{p}</span>
            </h3>
          </div>
          <div className="panelBody formGrid">
            <div className="field full">
              <label>SEO Title</label>
              <input
                value={seo.pages[p]?.title || ""}
                onChange={(e) => setPage(p, { title: e.target.value })}
                placeholder="e.g. Best Wedding Photographer in Your City | A One Photo Studio"
              />
            </div>
            <div className="field full">
              <label>Meta Description</label>
              <textarea
                value={seo.pages[p]?.description || ""}
                onChange={(e) => setPage(p, { description: e.target.value })}
                placeholder="150–160 characters that make people click"
                style={{ minHeight: 60 }}
              />
            </div>
            <div className="field">
              <label>Keywords (comma separated)</label>
              <input
                value={seo.pages[p]?.keywords || ""}
                onChange={(e) => setPage(p, { keywords: e.target.value })}
                placeholder="wedding photographer, candid, your city"
              />
            </div>
            <div className="field">
              <label>OG Image URL (social share preview)</label>
              <input value={seo.pages[p]?.ogImage || ""} onChange={(e) => setPage(p, { ogImage: e.target.value })} placeholder="/images/studio-poster.jpeg" />
            </div>
          </div>
        </div>
      ))}

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
