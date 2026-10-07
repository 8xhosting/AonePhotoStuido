"use client";

import Link from "next/link";
import { useState } from "react";
import {
  clearEnquiries,
  deleteEnquiry,
  exportEnquiriesCsv,
  getEnquiries,
  updateEnquiryStatus,
  type Enquiry,
  type EnquiryStatus,
} from "@/lib/enquiries";

const STATUSES: EnquiryStatus[] = ["New", "Contacted", "Booked", "Closed"];

/**
 * Studio admin dashboard.
 * Enquiries submitted from the booking form are stored in this browser
 * (localStorage) and managed here: status updates, filtering, CSV export.
 */
export default function AdminPage() {
  const [list, setList] = useState<Enquiry[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [filter, setFilter] = useState<"All" | EnquiryStatus>("All");

  const load = () => {
    setList(getEnquiries());
    setLoaded(true);
  };

  if (!loaded) {
    // Read storage after mount so SSR and hydration always match
    if (typeof window !== "undefined") load();
  }

  const refresh = () => setList(getEnquiries());

  const counts = STATUSES.reduce<Record<string, number>>((acc, s) => {
    acc[s] = list.filter((e) => e.status === s).length;
    return acc;
  }, {});

  const shown = filter === "All" ? list : list.filter((e) => e.status === filter);

  const fmt = (iso: string) => {
    try {
      return new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
    } catch {
      return iso;
    }
  };

  return (
    <>
      <section className="pageHero">
        <div className="container">
          <div className="script">Studio Admin</div>
          <h1>Enquiries Dashboard</h1>
          <p>
            Every booking enquiry submitted on this device appears here. Update status, export to CSV, or clear the
            list.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="adminStats">
            <div className="info">
              <b>Total Enquiries</b>
              <strong>{list.length}</strong>
            </div>
            {STATUSES.map((s) => (
              <div className="info" key={s}>
                <b>{s}</b>
                <strong>{counts[s] || 0}</strong>
              </div>
            ))}
          </div>

          <div className="adminBar">
            <div className="filters" style={{ marginBottom: 0 }}>
              {(["All", ...STATUSES] as const).map((s) => (
                <button key={s} className={filter === s ? "active" : ""} onClick={() => setFilter(s)}>
                  {s}
                </button>
              ))}
            </div>
            <div className="adminActions">
              <button className="btn whiteBtn" onClick={exportEnquiriesCsv} disabled={!list.length}>
                ⬇ Export CSV
              </button>
              <button
                className="btn whiteBtn danger"
                onClick={() => {
                  if (list.length && window.confirm("Delete ALL enquiries on this device?")) {
                    clearEnquiries();
                    refresh();
                  }
                }}
                disabled={!list.length}
              >
                Clear All
              </button>
            </div>
          </div>

          {shown.length === 0 ? (
            <div className="adminEmpty">
              <div className="successIcon dim">✉</div>
              <h3>No enquiries yet</h3>
              <p>
                Test the flow: submit the <Link href="/booking">booking form</Link> on this device, then come back
                here — the enquiry will appear in this dashboard.
              </p>
            </div>
          ) : (
            <div className="adminTableWrap">
              <table className="adminTable">
                <thead>
                  <tr>
                    <th>Ref</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Service</th>
                    <th>Package</th>
                    <th>Event Date</th>
                    <th>Received</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {shown.map((e) => (
                    <tr key={e.ref}>
                      <td>
                        <b>{e.ref}</b>
                      </td>
                      <td>{e.name}</td>
                      <td>
                        <a href={`tel:${e.phone}`}>{e.phone}</a>
                      </td>
                      <td>{e.service}</td>
                      <td>{e.pack}</td>
                      <td>{e.date || "—"}</td>
                      <td>{fmt(e.createdAt)}</td>
                      <td>
                        <select
                          className={`statusSel s-${e.status.toLowerCase()}`}
                          value={e.status}
                          onChange={(ev) => {
                            updateEnquiryStatus(e.ref, ev.target.value as EnquiryStatus);
                            refresh();
                          }}
                        >
                          {STATUSES.map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <button
                          className="rowDel"
                          onClick={() => {
                            if (window.confirm(`Delete enquiry ${e.ref}?`)) {
                              deleteEnquiry(e.ref);
                              refresh();
                            }
                          }}
                          aria-label={`Delete ${e.ref}`}
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
