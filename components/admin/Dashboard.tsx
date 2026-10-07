"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fmtDate, money, Pill } from "@/components/admin/ui";

type Stats = {
  totals: Record<string, number>;
  recentEnquiries: any[];
  upcomingBookings: any[];
  followupsDue: any[];
  outstanding: { id: string; name: string; remaining: number; eventDate: string; eventType: string }[];
  chart: { month: string; label: string; bookings: number; revenue: number }[];
  topServices: { name: string; count: number }[];
  topPackages: { name: string; count: number }[];
  photographerPerf: { name: string; bookings: number; revenue: number }[];
};

export default function Dashboard() {
  const [s, setS] = useState<Stats | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    fetch("/api/admin/stats", { cache: "no-store" })
      .then(async (r) => {
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || "Failed to load");
        setS(j);
      })
      .catch((e) => setErr(e instanceof Error ? e.message : "Failed to load"));
  }, []);

  if (err) return <div className="panel"><div className="panelBody empty">{err}</div></div>;
  if (!s) return <div className="panel"><div className="panelBody empty">Loading dashboard…</div></div>;

  const t = s.totals;
  const maxRev = Math.max(...s.chart.map((c) => c.revenue), 1);
  const maxBk = Math.max(...s.chart.map((c) => c.bookings), 1);
  const maxSvc = Math.max(...s.topServices.map((x) => x.count), 1);

  return (
    <>
      <div className="admStats">
        <StatCard icon="✉" label="Total Enquiries" value={t.enquiries} note={`${t.newEnquiries} new`} bg="#e8f0fe" />
        <StatCard icon="▤" label="Confirmed Bookings" value={t.confirmedBookings} note={`${t.upcomingEvents} upcoming`} bg="#e3f5e9" />
        <StatCard icon="▦" label="Today's Events" value={t.todaysEvents} note={t.todaysEvents ? "Shoot scheduled" : "No shoots today"} bg="#fef3e2" />
        <StatCard icon="⏰" label="Follow-ups Due" value={s.followupsDue.length} note={s.followupsDue.length ? "Need a call today" : "All caught up"} bg="#f3e8fd" />
        <StatCard icon="₽" label="Total Revenue" value={money(t.totalRevenue)} note={`${money(t.monthRevenue)} this month`} bg="#e3f5e9" />
        <StatCard icon="!" label="Pending Payments" value={money(t.pendingAmount)} note={`${t.pendingPayments} bookings`} bg="#fdeaea" />
        <StatCard icon="☺" label="Lead Conversion" value={`${t.conversion}%`} note={`${t.cancelled} cancelled`} bg="#e0f4fb" />
        <StatCard icon="❖" label="Portfolio" value={t.albums} note={`${t.photos} photos`} bg="#f3e8fd" />
      </div>

      <div className="admGrid2">
        <div>
          <div className="panel">
            <div className="panelHead">
              <h3>Bookings & Revenue — last 6 months</h3>
              <Link className="lnk" href="/admin/reports">
                Full reports →
              </Link>
            </div>
            <div className="panelBody">
              <div className="barChart">
                {s.chart.map((c) => (
                  <div className="barCol" key={c.month}>
                    <div className="bars">
                      <div className="bar bk" style={{ height: `${(c.bookings / maxBk) * 100}%` }} title={`${c.bookings} bookings`} />
                      <div className="bar rev" style={{ height: `${(c.revenue / maxRev) * 100}%` }} title={money(c.revenue)} />
                    </div>
                    <small>{c.label}</small>
                  </div>
                ))}
              </div>
              <div className="legend">
                <span>
                  <i style={{ background: "#f0b8bf" }} /> Bookings
                </span>
                <span>
                  <i style={{ background: "var(--red)" }} /> Revenue
                </span>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panelHead">
              <h3>Upcoming Bookings</h3>
              <Link className="lnk" href="/admin/bookings">
                All bookings →
              </Link>
            </div>
            <div className="panelBody rowList">
              {s.upcomingBookings.length === 0 && <div className="empty">No upcoming events yet.</div>}
              {s.upcomingBookings.map((b) => (
                <div className="rowItem" key={b.id}>
                  <div>
                    <b>{b.name}</b>
                    <small>
                      {b.eventType} · {fmtDate(b.eventDate)}{b.time ? ` · ${b.time}` : ""}
                    </small>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <b>{money(b.amount)}</b>
                    <br />
                    <Pill value={b.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panelHead">
              <h3>Pending Payments</h3>
              <Link className="lnk" href="/admin/payments">
                Record payment →
              </Link>
            </div>
            <div className="panelBody rowList">
              {s.outstanding.length === 0 && <div className="empty">Everything settled 🎉</div>}
              {s.outstanding.map((b) => (
                <div className="rowItem" key={b.id}>
                  <div>
                    <b>{b.name}</b>
                    <small>
                      {b.eventType} · {fmtDate(b.eventDate)}
                    </small>
                  </div>
                  <b style={{ color: "#b3261e" }}>{money(b.remaining)} due</b>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="panel">
            <div className="panelHead">
              <h3>Follow-ups Due</h3>
              <Link className="lnk" href="/admin/followups">
                All →
              </Link>
            </div>
            <div className="panelBody rowList">
              {s.followupsDue.length === 0 && <div className="empty">Nothing due — great follow-up game! 👏</div>}
              {s.followupsDue.map((e) => (
                <div className="rowItem" key={e.id}>
                  <div>
                    <b>{e.name}</b>
                    <small>
                      {e.eventType} · due {fmtDate(e.followUpDate)}
                    </small>
                  </div>
                  <Pill value={e.status} />
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panelHead">
              <h3>Recent Enquiries</h3>
              <Link className="lnk" href="/admin/enquiries">
                All enquiries →
              </Link>
            </div>
            <div className="panelBody rowList">
              {s.recentEnquiries.length === 0 && <div className="empty">No enquiries yet — share your website!</div>}
              {s.recentEnquiries.map((e) => (
                <div className="rowItem" key={e.id}>
                  <div>
                    <b>{e.name}</b>
                    <small>
                      {e.eventType} · {fmtDate(e.createdAt)}
                    </small>
                  </div>
                  <Pill value={e.status} />
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panelHead">
              <h3>Most Popular Services</h3>
            </div>
            <div className="panelBody">
              {s.topServices.length === 0 ? (
                <div className="empty">Data appears once bookings are created.</div>
              ) : (
                <div className="hBars">
                  {s.topServices.map((x) => (
                    <div className="hBar" key={x.name}>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{x.name}</span>
                      <div className="track">
                        <div className="fill" style={{ width: `${(x.count / maxSvc) * 100}%` }} />
                      </div>
                      <b>{x.count}</b>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {s.photographerPerf.length > 0 && (
            <div className="panel">
              <div className="panelHead">
                <h3>Crew Performance</h3>
                <Link className="lnk" href="/admin/team">
                  Manage team →
                </Link>
              </div>
              <div className="panelBody rowList">
                {s.photographerPerf.map((p) => (
                  <div className="rowItem" key={p.name}>
                    <b>{p.name}</b>
                    <small>
                      {p.bookings} booking(s) · {money(p.revenue)}
                    </small>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function StatCard({ icon, label, value, note, bg }: { icon: string; label: string; value: string | number; note?: string; bg: string }) {
  return (
    <div className="statCard">
      <span className="statIcon" style={{ background: bg }}>
        {icon}
      </span>
      <div>
        <b>{value}</b>
        <span>{label}</span>
        {note && <small>{note}</small>}
      </div>
    </div>
  );
}
