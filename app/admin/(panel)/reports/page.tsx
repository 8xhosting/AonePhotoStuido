"use client";

import { useEffect, useState } from "react";
import { downloadCsv, fmtDate, money, useCrud } from "@/components/admin/ui";

type Stats = {
  totals: Record<string, number>;
  chart: { month: string; label: string; bookings: number; revenue: number }[];
  topServices: { name: string; count: number }[];
  topPackages: { name: string; count: number }[];
  photographerPerf: { name: string; bookings: number; revenue: number }[];
  outstanding: { name: string; remaining: number; eventDate: string; eventType: string; phone: string }[];
};

/** Business reports — analytics plus CSV exports. */
export default function ReportsPage() {
  const [s, setS] = useState<Stats | null>(null);
  const bookings = useCrud("bookings");
  const payments = useCrud("payments");
  const enquiries = useCrud("enquiries");

  useEffect(() => {
    fetch("/api/admin/stats", { cache: "no-store" })
      .then((r) => r.json())
      .then(setS)
      .catch(() => setS(null));
  }, []);

  if (!s) return <div className="panel"><div className="panelBody empty">Loading reports…</div></div>;

  const t = s.totals;
  const maxRev = Math.max(...s.chart.map((c) => c.revenue), 1);
  const maxSvc = Math.max(...s.topServices.map((x) => x.count), 1);
  const maxPkg = Math.max(...s.topPackages.map((x) => x.count), 1);

  return (
    <>
      <div className="admHead">
        <div>
          <h2>Reports</h2>
          <p>Revenue, bookings and lead analytics — export anything as CSV/Excel</p>
        </div>
        <div className="admHeadActions">
          <button className="admBtn" onClick={() => downloadCsv("bookings.csv", bookings.items, [
            { key: "name", label: "Client" }, { key: "phone", label: "Phone" }, { key: "eventType", label: "Event" },
            { key: "eventDate", label: "Date" }, { key: "venue", label: "Venue" }, { key: "package", label: "Package" },
            { key: "amount", label: "Amount" }, { key: "advance", label: "Advance" }, { key: "status", label: "Status" },
          ])}>
            ⬇ Bookings
          </button>
          <button className="admBtn" onClick={() => downloadCsv("payments.csv", payments.items, [
            { key: "date", label: "Date" }, { key: "client", label: "Client" }, { key: "amount", label: "Amount" },
            { key: "method", label: "Method" }, { key: "txnId", label: "Txn ID" }, { key: "status", label: "Status" },
          ])}>
            ⬇ Payments
          </button>
          <button className="admBtn" onClick={() => downloadCsv("enquiries.csv", enquiries.items, [
            { key: "createdAt", label: "Received" }, { key: "name", label: "Name" }, { key: "phone", label: "Phone" },
            { key: "eventType", label: "Event" }, { key: "eventDate", label: "Event Date" }, { key: "status", label: "Status" },
          ])}>
            ⬇ Enquiries
          </button>
        </div>
      </div>

      <div className="admStats">
        <div className="statCard"><span className="statIcon" style={{ background: "#e3f5e9" }}>₽</span><div><b>{money(t.totalRevenue)}</b><span>Total Revenue</span></div></div>
        <div className="statCard"><span className="statIcon" style={{ background: "#e8f0fe" }}>▤</span><div><b>{bookings.items.length}</b><span>Total Bookings</span></div></div>
        <div className="statCard"><span className="statIcon" style={{ background: "#fef3e2" }}>✉</span><div><b>{enquiries.items.length}</b><span>Total Enquiries</span></div></div>
        <div className="statCard"><span className="statIcon" style={{ background: "#e0f4fb" }}>%</span><div><b>{t.conversion}%</b><span>Lead Conversion</span></div></div>
        <div className="statCard"><span className="statIcon" style={{ background: "#fdeaea" }}>!</span><div><b>{money(t.pendingAmount)}</b><span>Pending Payments</span></div></div>
        <div className="statCard"><span className="statIcon" style={{ background: "#fdeaea" }}>✕</span><div><b>{t.cancelled}</b><span>Cancelled Bookings</span></div></div>
      </div>

      <div className="admGrid2">
        <div>
          <div className="panel">
            <div className="panelHead"><h3>Monthly Revenue (last 6 months)</h3></div>
            <div className="panelBody">
              <div className="barChart">
                {s.chart.map((c) => (
                  <div className="barCol" key={c.month}>
                    <div className="bars">
                      <div className="bar rev" style={{ height: `${(c.revenue / maxRev) * 100}%` }} title={money(c.revenue)} />
                    </div>
                    <small>{c.label}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panelHead"><h3>Pending Payments Detail</h3></div>
            <div className="panelBody rowList">
              {s.outstanding.length === 0 && <div className="empty">No pending payments 🎉</div>}
              {s.outstanding.map((o, i) => (
                <div className="rowItem" key={i}>
                  <div>
                    <b>{o.name}</b>
                    <small>{o.eventType} · {fmtDate(o.eventDate)} · {o.phone}</small>
                  </div>
                  <b style={{ color: "#b3261e" }}>{money(o.remaining)}</b>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="panel">
            <div className="panelHead"><h3>Most Popular Services</h3></div>
            <div className="panelBody">
              {s.topServices.length === 0 ? <div className="empty">No bookings yet.</div> : (
                <div className="hBars">
                  {s.topServices.map((x) => (
                    <div className="hBar" key={x.name}>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{x.name}</span>
                      <div className="track"><div className="fill" style={{ width: `${(x.count / maxSvc) * 100}%` }} /></div>
                      <b>{x.count}</b>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="panel">
            <div className="panelHead"><h3>Most Popular Packages</h3></div>
            <div className="panelBody">
              {s.topPackages.length === 0 ? <div className="empty">No package bookings yet.</div> : (
                <div className="hBars">
                  {s.topPackages.map((x) => (
                    <div className="hBar" key={x.name}>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{x.name}</span>
                      <div className="track"><div className="fill" style={{ width: `${(x.count / maxPkg) * 100}%` }} /></div>
                      <b>{x.count}</b>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="panel">
            <div className="panelHead"><h3>Crew Performance</h3></div>
            <div className="panelBody rowList">
              {s.photographerPerf.length === 0 && <div className="empty">Assign crew to bookings to see performance.</div>}
              {s.photographerPerf.map((p) => (
                <div className="rowItem" key={p.name}>
                  <b>{p.name}</b>
                  <small>{p.bookings} booking(s)</small>
                  <b>{money(p.revenue)}</b>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
