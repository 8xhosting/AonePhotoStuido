"use client";

import { useState } from "react";
import { ImageUpload, ImagesEditor, Modal, TagsEditor, useCrud, fmtDateTime } from "@/components/admin/ui";
import { CATEGORIES, EVENT_COLORS } from "@/components/admin/configs";

type Album = {
  id: string;
  title: string;
  category: string;
  cover: string;
  photos: { url: string; caption?: string }[];
  videos: string[];
  featured: boolean;
};

/** Portfolio manager — albums with photo uploads, categories and featured flag. */
export default function PortfolioPage() {
  const crud = useCrud("albums");
  const [editing, setEditing] = useState<Record<string, any> | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Partial<Album>>({});
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setForm({ photos: [], videos: [], category: "Wedding", featured: false });
    setCreating(true);
  };
  const openEdit = (a: Record<string, any>) => {
    setForm({ title: a.title, category: a.category, cover: a.cover, featured: a.featured, photos: a.photos || [], videos: a.videos || [] });
    setEditing(a);
  };

  const save = async () => {
    if (!String(form.title || "").trim()) return alert("Please enter an album title");
    setSaving(true);
    try {
      if (editing) await crud.update(editing.id, form as Record<string, unknown>);
      else await crud.create(form as Record<string, unknown>);
      setEditing(null);
      setCreating(false);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const del = async (a: Record<string, any>) => {
    if (!window.confirm(`Delete album "${a.title}"? Photos stay in storage but the album is removed from the website.`)) return;
    await crud.remove(a.id);
  };

  return (
    <>
      <div className="admHead">
        <div>
          <h2>Photos & Albums</h2>
          <p>Albums appear on the Portfolio and Gallery pages — first photo becomes the cover</p>
        </div>
        <div className="admHeadActions">
          <button className="admBtn primary" onClick={openCreate}>
            + New Album
          </button>
        </div>
      </div>

      {crud.items.length === 0 && !crud.loading && (
        <div className="panel">
          <div className="panelBody empty">No albums yet. Create your first album and upload some work — it goes live instantly.</div>
        </div>
      )}

      <div className="albumGrid">
        {crud.items.map((a) => (
          <div className="albumCard" key={a.id}>
            <div className="thumb">
              {a.featured && <span className="feat">FEATURED</span>}
              <img src={a.cover || a.photos?.[0]?.url || "/images/studio-wall.jpeg"} alt={a.title} />
              <span className="cnt">{a.photos?.length || 0} 📷 {a.videos?.length ? `· ${a.videos.length} 🎬` : ""}</span>
            </div>
            <div className="meta">
              <b>{a.title}</b>
              <small>
                <span style={{ color: EVENT_COLORS[a.category] || EVENT_COLORS.Other, fontWeight: 800 }}>{a.category}</span> · added {fmtDateTime(a.createdAt).split(",")[0]}
              </small>
            </div>
            <div className="acts">
              <button className="admBtn small" style={{ flex: 1 }} onClick={() => openEdit(a)}>
                ✎ Edit
              </button>
              <button className="rowBtn danger" onClick={() => del(a)} title="Delete album">
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>

      {(creating || editing) && (
        <Modal
          title={editing ? "Edit Album" : "New Album"}
          wide
          onClose={() => {
            setEditing(null);
            setCreating(false);
          }}
          footer={
            <>
              <button
                className="admBtn"
                onClick={() => {
                  setEditing(null);
                  setCreating(false);
                }}
              >
                Cancel
              </button>
              <button className="admBtn primary" onClick={save} disabled={saving}>
                {saving ? "Saving…" : "Save Album"}
              </button>
            </>
          }
        >
          <div className="formGrid">
            <div className="field">
              <label>
                Album Title <em>*</em>
              </label>
              <input value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Rohit & Neha Wedding" />
            </div>
            <div className="field">
              <label>Category</label>
              <select value={form.category || "Wedding"} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="field full">
              <label>Cover Photo</label>
              <ImageUpload value={form.cover} onChange={(url) => setForm({ ...form, cover: url })} label="Upload cover photo" />
            </div>
            <div className="field full">
              <label>Photos (first one is the cover)</label>
              <ImagesEditor value={form.photos || []} onChange={(photos) => setForm({ ...form, photos })} />
            </div>
            <div className="field full">
              <label>Video Links (YouTube / Drive / Reels URLs)</label>
              <TagsEditor value={form.videos || []} onChange={(videos) => setForm({ ...form, videos })} placeholder="Paste a video URL and press Enter" />
            </div>
            <label className="checkRow">
              <input type="checkbox" checked={!!form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
              Featured album (shown on homepage)
            </label>
          </div>
        </Modal>
      )}
    </>
  );
}
