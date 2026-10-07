"use client";

import { useMemo, useState } from "react";
import {
  ImageUpload,
  ImagesEditor,
  Modal,
  Pill,
  TagsEditor,
  fmtDate,
  fmtDateTime,
  money,
  useCrud,
  useCollection,
  downloadCsv,
  type Row,
  waLink,
} from "./ui";

/* ─────────────────────────────────────────────────────────────────────────── */
/* Config types                                                               */
/* ─────────────────────────────────────────────────────────────────────────── */

export type FieldDef = {
  key: string;
  label: string;
  type:
    | "text" | "textarea" | "number" | "date" | "time" | "email" | "tel"
    | "select" | "checkbox" | "tags" | "image" | "images" | "password" | "stars" | "color";
  options?: string[];
  optionsFrom?: { collection: string; label: (o: Row) => string; value?: (o: Row) => string };
  required?: boolean;
  full?: boolean;
  placeholder?: string;
  hint?: string;
  createOnly?: boolean; // only shown when creating (e.g. password)
};

export type ColumnDef = {
  key: string;
  label: string;
  render?: (row: Row, ctx: { extra: Record<string, Row[]> }) => React.ReactNode;
};

export type CrudConfig = {
  collection: string;
  title: string;
  subtitle: string;
  fields: FieldDef[];
  columns: ColumnDef[];
  searchKeys: string[];
  statusKey?: string;
  statuses?: string[];
  defaults?: Record<string, unknown>;
  extraCollections?: Record<string, string>; // name -> variable exposed to render ctx
  rowActions?: (row: Row, api: { reload: () => void; update: (id: string, patch: Row) => Promise<Row | null>; templates: Row[] }) => React.ReactNode;
  addLabel?: string;
  csv?: { key: string; label: string }[];
};

/* ─────────────────────────────────────────────────────────────────────────── */
/* Page component                                                             */
/* ─────────────────────────────────────────────────────────────────────────── */

export default function CrudPage({ config }: { config: CrudConfig }) {
  const crud = useCrud(config.collection);
  const templates = useCollection("templates");
  const extra: Record<string, Row[]> = {};
  for (const [varName, colName] of Object.entries(config.extraCollections || {})) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    extra[varName] = useCollection(colName);
  }

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [editing, setEditing] = useState<Row | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Record<string, any>>({});
  const [formErr, setFormErr] = useState("");
  const [saving, setSaving] = useState(false);

  const rows = useMemo(() => {
    let list = crud.items;
    if (config.statusKey && status !== "All") list = list.filter((r) => r[config.statusKey!] === status);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((r) => config.searchKeys.some((k) => String(r[k] || "").toLowerCase().includes(q)));
    }
    return list;
  }, [crud.items, search, status, config]);

  const openCreate = () => {
    setForm({ ...(config.defaults || {}) });
    setFormErr("");
    setCreating(true);
  };

  const openEdit = (row: Row) => {
    const snapshot: Record<string, any> = {};
    for (const f of config.fields) snapshot[f.key] = row[f.key];
    setForm(snapshot);
    setFormErr("");
    setEditing(row);
  };

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true);
    setFormErr("");
    try {
      const missing = config.fields.filter((f) => f.required && !String(form[f.key] ?? "").trim());
      if (missing.length) throw new Error(`Please fill: ${missing.map((m) => m.label).join(", ")}`);
      if (editing) await crud.update(editing.id, form);
      else await crud.create(form);
      setEditing(null);
      setCreating(false);
    } catch (e) {
      setFormErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const del = async (row: Row) => {
    if (!window.confirm("Delete this record permanently?")) return;
    try {
      await crud.remove(row.id);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const ctx = { extra };

  return (
    <>
      <div className="admHead">
        <div>
          <h2>{config.title}</h2>
          <p>{config.subtitle}</p>
        </div>
        <div className="admHeadActions">
          {config.csv && (
            <button className="admBtn" onClick={() => downloadCsv(`${config.collection}-${new Date().toISOString().slice(0, 10)}.csv`, rows, config.csv!)}>
              ⬇ Export CSV
            </button>
          )}
          <button className="admBtn primary" onClick={openCreate}>
            + {config.addLabel || "Add New"}
          </button>
        </div>
      </div>

      <div className="admToolbar">
        <div className="admSearch">
          <span>🔍</span>
          <input placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        {config.statuses && (
          <div className="chipFilters">
            {["All", ...config.statuses].map((s) => (
              <button key={s} className={status === s ? "active" : ""} onClick={() => setStatus(s)}>
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="admTableCard">
        <div className="admTableScroll">
          <table className="admTbl">
            <thead>
              <tr>
                {config.columns.map((c) => (
                  <th key={c.key}>{c.label}</th>
                ))}
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {crud.loading && (
                <tr>
                  <td colSpan={config.columns.length + 1}>
                    <div className="empty">Loading…</div>
                  </td>
                </tr>
              )}
              {!crud.loading && rows.length === 0 && (
                <tr>
                  <td colSpan={config.columns.length + 1}>
                    <div className="empty">
                      {crud.error ? crud.error : "Nothing here yet — add your first record."}
                    </div>
                  </td>
                </tr>
              )}
              {rows.map((row) => (
                <tr key={row.id}>
                  {config.columns.map((c) => (
                    <td key={c.key}>
                      {c.render ? c.render(row, ctx) : renderCell(row[c.key])}
                    </td>
                  ))}
                  <td>
                    <div className="actions">
                      {config.rowActions?.(row, { reload: crud.reload, update: crud.update, templates })}
                      <button className="rowBtn" title="Edit" onClick={() => openEdit(row)}>
                        ✎
                      </button>
                      <button className="rowBtn danger" title="Delete" onClick={() => del(row)}>
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {(creating || editing) && (
        <Modal
          title={editing ? `Edit — ${config.title}` : `New — ${config.title}`}
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
                {saving ? "Saving…" : editing ? "Save Changes" : `Create ${config.title}`}
              </button>
            </>
          }
        >
          <div className="formGrid">
            {formErr && <div className="formErr">{formErr}</div>}
            {config.fields
              .filter((f) => !(editing && f.createOnly))
              .map((f) => (
                <div className={`field ${f.full ? "full" : ""}`} key={f.key}>
                  <label>
                    {f.label} {f.required && <em>*</em>}
                  </label>
                  <FieldInput field={f} value={form[f.key]} onChange={(v) => set(f.key, v)} />
                  {f.hint && <span className="hint">{f.hint}</span>}
                </div>
              ))}
          </div>
        </Modal>
      )}
    </>
  );
}

function renderCell(v: unknown): React.ReactNode {
  if (v === undefined || v === null || v === "") return <span style={{ color: "#a39a97" }}>—</span>;
  if (typeof v === "boolean") return <Pill value={v ? "Confirmed" : "Cancelled"} />;
  if (Array.isArray(v)) return <span style={{ fontSize: 12 }}>{v.length} item(s)</span>;
  return String(v);
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Field renderer                                                             */
/* ─────────────────────────────────────────────────────────────────────────── */

export function FieldInput({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const opts = useCollection(field.optionsFrom?.collection || "");

  switch (field.type) {
    case "textarea":
      return <textarea value={String(value ?? "")} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} />;
    case "number":
      return <input type="number" value={value === undefined || value === null ? "" : String(value)} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))} />;
    case "date":
      return <input type="date" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />;
    case "time":
      return <input type="time" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />;
    case "checkbox":
      return (
        <label className="checkRow" style={{ paddingTop: 4 }}>
          <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
          Enabled
        </label>
      );
    case "select":
      return (
        <select value={String(value ?? "")} onChange={(e) => onChange(e.target.value)}>
          {!value && <option value="">Select…</option>}
          {(field.options || []).map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      );
    case "tags":
      return <TagsEditor value={Array.isArray(value) ? (value as string[]) : []} onChange={onChange} placeholder={field.placeholder} />;
    case "image":
      return <ImageUpload value={String(value ?? "")} onChange={(url) => onChange(url)} label={field.placeholder} />;
    case "images":
      return <ImagesEditor value={Array.isArray(value) ? value : []} onChange={onChange} />;
    case "password":
      return <input type="password" value={String(value ?? "")} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} />;
    case "stars":
      return (
        <div style={{ display: "flex", gap: 4, fontSize: 21, cursor: "pointer" }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <span key={n} onClick={() => onChange(n)} style={{ color: n <= Number(value || 0) ? "#e9a820" : "#d8ccca" }}>
              ★
            </span>
          ))}
        </div>
      );
    default: {
      if (field.optionsFrom) {
        const { label, value: valFn } = field.optionsFrom;
        return (
          <select value={String(value ?? "")} onChange={(e) => onChange(e.target.value)}>
            <option value="">Select…</option>
            {opts.map((o) => (
              <option key={o.id} value={valFn ? valFn(o) : o.name || o.title || o.id}>
                {label(o)}
              </option>
            ))}
          </select>
        );
      }
      return <input type="text" value={String(value ?? "")} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} />;
    }
  }
}

/* Shared small renderers used by page configs */
export const cellDate = (v: string) => fmtDate(v);
export const cellMoney = (v: number) => <span className="num">{money(v)}</span>;
export const cellPill = (v: string) => <Pill value={v} />;
export const cellDateTime = (v: string) => fmtDateTime(v);
export { waLink, money, fmtDate, fmtDateTime };
