"use client";

import { useCrud, fmtDateTime } from "@/components/admin/ui";

const ICONS: Record<string, string> = {
  enquiry: "✉",
  booking: "▤",
  payment: "₽",
  event: "▦",
  followup: "⏰",
  system: "⚙",
};

export default function NotificationsPage() {
  const { items, loading, update, remove, reload } = useCrud("notifications");

  const markAll = async () => {
    await fetch("/api/admin/notifications-read", { method: "POST" });
    reload();
  };

  return (
    <>
      <div className="admHead">
        <div>
          <h2>Notifications</h2>
          <p>Enquiries, bookings, payments and reminders</p>
        </div>
        <div className="admHeadActions">
          <button className="admBtn" onClick={markAll}>
            ✓ Mark all read
          </button>
        </div>
      </div>

      <div className="panel">
        <div className="panelBody">
          {loading && <div className="empty">Loading…</div>}
          {!loading && items.length === 0 && <div className="empty">No notifications yet. New enquiries will appear here.</div>}
          {items.map((n) => (
            <div className="notifItem" key={n.id}>
              <span className={`notifDot ${n.read ? "read" : ""}`} />
              <span style={{ fontSize: 17 }}>{ICONS[n.type] || "•"}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <b>{n.title}</b>
                {n.body && <p>{n.body}</p>}
              </div>
              <small>{fmtDateTime(n.createdAt)}</small>
              {!n.read && (
                <button className="rowBtn" title="Mark read" onClick={() => update(n.id, { read: true })}>
                  ✓
                </button>
              )}
              <button className="rowBtn danger" title="Delete" onClick={() => remove(n.id)}>
                🗑
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
