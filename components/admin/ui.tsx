"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────────────────────────────────── */
/* Helpers                                                                    */
/* ─────────────────────────────────────────────────────────────────────────── */

export const waLink = (phone: string, text: string) =>
  `https://wa.me/${(phone || "").replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;

export const money = (n: number | string) =>
  `₹${Number(n || 0).toLocaleString("en-IN")}`;

export const fmtDate = (iso?: string) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

export const fmtDateTime = (iso?: string) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
};

export function Pill({ value }: { value?: string }) {
  if (!value) return <span className="pill grey">—</span>;
  return <span className={`pill ${value.replace(/\s/g, "")}`}>{value}</span>;
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Modal                                                                      */
/* ─────────────────────────────────────────────────────────────────────────── */

export function Modal({
  title,
  onClose,
  children,
  footer,
  wide,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="modalOverlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modalPanel" style={wide ? { maxWidth: 860 } : undefined}>
        <div className="modalHead">
          <h3>{title}</h3>
          <button className="modalClose" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="modalBody">{children}</div>
        {footer && <div className="modalFoot">{footer}</div>}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Field building blocks                                                      */
/* ─────────────────────────────────────────────────────────────────────────── */

export function TagsEditor({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const v = draft.trim();
    if (!v) return;
    onChange([...value, v]);
    setDraft("");
  };
  return (
    <div className="tagBox">
      {value.map((t, i) => (
        <span className="tag" key={`${t}-${i}`}>
          {t}
          <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} aria-label={`Remove ${t}`}>
            ×
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            add();
          }
        }}
        onBlur={add}
        placeholder={placeholder || "Type and press Enter"}
      />
    </div>
  );
}

export function ImageUpload({
  value,
  onChange,
  label,
}: {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const upload = async (file: File) => {
    setBusy(true);
    setErr("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");
      onChange(json.url);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="imgUp">
        {value ? <img src={value} alt="" /> : <span style={{ fontSize: 26, opacity: 0.35 }}>🖼</span>}
        <div>
          <button type="button" className={`upBtn ${busy ? "busy" : ""}`} onClick={() => ref.current?.click()}>
            {busy ? "Uploading…" : value ? "Replace image" : label || "Upload image"}
          </button>
          {value && (
            <button type="button" className="clearBtn" onClick={() => onChange("")} style={{ marginLeft: 9 }}>
              remove
            </button>
          )}
          <input
            ref={ref}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
          />
        </div>
      </div>
      {err && <div className="hint" style={{ color: "#b3261e" }}>{err}</div>}
    </div>
  );
}

/** Multi-image editor with per-photo captions + cover selection (albums). */
export function ImagesEditor({
  value,
  onChange,
}: {
  value: { url: string; caption?: string }[];
  onChange: (v: { url: string; caption?: string }[]) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const upload = async (files: FileList) => {
    setBusy(true);
    try {
      const added: { url: string }[] = [];
      for (const file of Array.from(files).slice(0, 10)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const json = await res.json();
        if (res.ok) added.push({ url: json.url });
      }
      onChange([...value, ...added]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="imgList">
        {value.map((p, i) => (
          <div className="imgCell" key={`${p.url}-${i}`}>
            {i === 0 && <span className="cover">COVER</span>}
            <img src={p.url} alt="" />
            <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} aria-label="Remove">
              ×
            </button>
            <div className="cap">
              <input
                placeholder="Caption"
                value={p.caption || ""}
                onChange={(e) => {
                  const next = [...value];
                  next[i] = { ...next[i], caption: e.target.value };
                  onChange(next);
                }}
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          className={`upBtn ${busy ? "busy" : ""}`}
          onClick={() => ref.current?.click()}
          style={{ minHeight: 72, border: "1.5px dashed var(--line)", background: "#fdf7f5", borderRadius: 10 }}
        >
          {busy ? "Uploading…" : "+ Add photos"}
        </button>
        <input ref={ref} type="file" accept="image/*" multiple hidden onChange={(e) => e.target.files && upload(e.target.files)} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* CRUD hook                                                                  */
/* ─────────────────────────────────────────────────────────────────────────── */

export type Row = Record<string, any> & { id: string };

export function useCrud(collection: string) {
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/crud/${collection}`, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load");
      setItems(json.items);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [collection]);

  useEffect(() => {
    reload();
  }, [reload]);

  const create = async (data: Record<string, any>): Promise<Row | null> => {
    const res = await fetch(`/api/admin/crud/${collection}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Save failed");
    setItems((prev) => [json.item, ...prev]);
    return json.item;
  };

  const update = async (id: string, patch: Record<string, any>): Promise<Row | null> => {
    const res = await fetch(`/api/admin/crud/${collection}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Update failed");
    setItems((prev) => prev.map((x) => (x.id === id ? json.item : x)));
    return json.item;
  };

  const remove = async (id: string) => {
    const res = await fetch(`/api/admin/crud/${collection}/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Delete failed");
    setItems((prev) => prev.filter((x) => x.id !== id));
  };

  return { items, loading, error, reload, create, update, remove };
}

/** Fetch a collection read-only (for dynamic dropdown options). */
export function useCollection(name: string): Row[] {
  const [items, setItems] = useState<Row[]>([]);
  useEffect(() => {
    fetch(`/api/admin/crud/${name}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then((j) => setItems(j.items || []))
      .catch(() => setItems([]));
  }, [name]);
  return items;
}

export function downloadCsv(filename: string, rows: Row[], columns: { key: string; label: string }[]) {
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [
    columns.map((c) => esc(c.label)).join(","),
    ...rows.map((r) => columns.map((c) => esc(typeof r[c.key] === "object" ? JSON.stringify(r[c.key]) : r[c.key])).join(",")),
  ].join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
