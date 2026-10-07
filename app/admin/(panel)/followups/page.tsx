"use client";

import { useEffect, useState } from "react";
import { Pill, fmtDate, waLink, useCrud } from "@/components/admin/ui";

const OPEN = ["New", "Contacted", "Follow-up", "Quoted"];

/** Follow-ups — open leads whose follow-up date is today or overdue. */
export default function FollowupsPage() {
  const { items, loading, update } = useCrud("enquiries");
  const [today, setToday] = useState("");

  useEffect(() => {
    setToday(new Date().toISOString().slice(0, 10));
  }, []);

  const due = items
    .filter((e) => OPEN.includes(e.status) && e.followUpDate && e.followUpDate <= today)
    .sort((a, b) => (a.followUpDate || "").localeCompare(b.followUpDate || ""));
  const upcoming = items
    .filter((e) => OPEN.includes(e.status) && e.followUpDate && e.followUpDate > today)
    .sort((a, b) => (a.followUpDate || "").localeCompare(b.followUpDate || ""));

  const snooze = async (id: string, days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    await update(id, { followUpDate: d.toISOString().slice(0, 10) });
  };

  return (
    <>
      <div className="admHead">
        <div>
          <h2>Follow-ups</h2>
          <p>Leads that need a call today — keep the pipeline moving</p>
        </div>
      </div>

      <div className="panel">
        <div className="panelHead">
          <h3>Due now ({due.length})</h3>
        </div>
        <div className="panelBody rowList">
          {loading && <div className="empty">Loading…</div>}
          {!loading && due.length === 0 && <div className="empty">Nothing due today — great follow-up game! 👏</div>}
          {due.map((e) => (
            <div className="rowItem" key={e.id}>
              <div>
                <b>{e.name}</b>
                <small>
                  {e.phone} · {e.eventType}
                  {e.eventDate ? ` · event ${fmtDate(e.eventDate)}` : ""} · follow-up was {fmtDate(e.followUpDate)}
                </small>
              </div>
              <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                <Pill value={e.status} />
                <a className="rowBtn wa" title="WhatsApp" href={waLink(e.phone, `Hi ${e.name}! Following up on your ${e.eventType} enquiry with A One Photo Studio.`)} target="_blank" rel="noopener noreferrer">
                  ✆
                </a>
                <a className="rowBtn" title="Call" href={`tel:${e.phone}`}>
                  ☎
                </a>
                <button className="admBtn small" onClick={() => snooze(e.id, 2)} title="Remind me in 2 days">
                  +2d
                </button>
                <button className="admBtn small" onClick={() => snooze(e.id, 7)}>
                  +1w
                </button>
                <button className="admBtn small primary" onClick={() => update(e.id, { status: "Contacted", followUpDate: "" })}>
                  Mark Contacted
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="panel">
        <div className="panelHead">
          <h3>Scheduled later ({upcoming.length})</h3>
        </div>
        <div className="panelBody rowList">
          {!loading && upcoming.length === 0 && <div className="empty">No future follow-ups scheduled.</div>}
          {upcoming.map((e) => (
            <div className="rowItem" key={e.id}>
              <div>
                <b>{e.name}</b>
                <small>
                  {e.phone} · {e.eventType} · due {fmtDate(e.followUpDate)}
                </small>
              </div>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <Pill value={e.status} />
                <a className="rowBtn wa" title="WhatsApp" href={waLink(e.phone, `Hi ${e.name}!`)} target="_blank" rel="noopener noreferrer">
                  ✆
                </a>
                <button className="admBtn small" onClick={() => update(e.id, { followUpDate: today })}>
                  Pull to today
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
