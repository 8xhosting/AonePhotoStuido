"use client";

import { useEffect, useMemo, useState } from "react";
import { Modal, money, useCrud } from "@/components/admin/ui";
import { EVENT_COLORS } from "@/components/admin/configs";

const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** Month-view event calendar built from bookings, colour-coded by event type. */
export default function CalendarPage() {
  const { items } = useCrud("bookings");
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return { y: d.getFullYear(), m: d.getMonth() };
  });
  const [dayOpen, setDayOpen] = useState<string | null>(null);
  const [today, setToday] = useState("");

  useEffect(() => {
    const d = new Date();
    setToday(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`);
  }, []);

  const byDate = useMemo(() => {
    const map = new Map<string, typeof items>();
    for (const b of items) {
      if (b.status === "Cancelled" || !b.eventDate) continue;
      const list = map.get(b.eventDate) || [];
      list.push(b);
      map.set(b.eventDate, list);
    }
    return map;
  }, [items]);

  const grid = useMemo(() => {
    const first = new Date(cursor.y, cursor.m, 1);
    const start = new Date(first);
    start.setDate(1 - first.getDay());
    const cells: { date: string; inMonth: boolean }[] = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      cells.push({
        date: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
        inMonth: d.getMonth() === cursor.m,
      });
    }
    return cells;
  }, [cursor]);

  const move = (delta: number) => {
    const d = new Date(cursor.y, cursor.m + delta, 1);
    setCursor({ y: d.getFullYear(), m: d.getMonth() });
  };

  const dayEvents = dayOpen ? byDate.get(dayOpen) || [] : [];

  return (
    <>
      <div className="calHead">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <h2>
            {MONTHS[cursor.m]} {cursor.y}
          </h2>
          <div className="calNav">
            <button className="rowBtn" onClick={() => move(-1)} aria-label="Previous month">
              ‹
            </button>
            <button
              className="rowBtn"
              onClick={() => {
                const d = new Date();
                setCursor({ y: d.getFullYear(), m: d.getMonth() });
              }}
              title="Today"
            >
              ●
            </button>
            <button className="rowBtn" onClick={() => move(1)} aria-label="Next month">
              ›
            </button>
          </div>
        </div>
        <div className="calLegend">
          {Object.entries(EVENT_COLORS).map(([k, c]) => (
            <span key={k}>
              <i style={{ background: c }} /> {k}
            </span>
          ))}
        </div>
      </div>

      <div className="panel" style={{ padding: 14 }}>
        <div className="calGrid">
          {DOW.map((d) => (
            <div className="calDow" key={d}>
              {d}
            </div>
          ))}
          {grid.map((cell) => {
            const events = byDate.get(cell.date) || [];
            return (
              <div
                key={cell.date}
                className={`calCell ${cell.inMonth ? "" : "dim"} ${cell.date === today ? "today" : ""} ${events.length ? "hasEv" : ""}`}
                onClick={() => events.length && setDayOpen(cell.date)}
                style={{ cursor: events.length ? "pointer" : "default" }}
              >
                <span className="d">{Number(cell.date.slice(8))}</span>
                {events.slice(0, 2).map((b) => (
                  <span className="calEv" key={b.id} style={{ background: EVENT_COLORS[b.eventType] || EVENT_COLORS.Other }} title={`${b.name} · ${b.eventType}`}>
                    {b.name}
                  </span>
                ))}
                {events.length > 2 && <span className="calMore">+{events.length - 2} more</span>}
              </div>
            );
          })}
        </div>
      </div>

      {dayOpen && (
        <Modal title={`Events — ${dayOpen}`} onClose={() => setDayOpen(null)}>
          <div className="rowList">
            {dayEvents.map((b) => (
              <div className="rowItem" key={b.id}>
                <div>
                  <b>{b.name}</b>
                  <small>
                    {b.eventType} · {b.time || "time TBD"} · {b.venue || "venue TBD"}
                  </small>
                </div>
                <div style={{ textAlign: "right" }}>
                  <b>{money(b.amount)}</b>
                  <small style={{ display: "block" }}>{b.status}</small>
                </div>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </>
  );
}
