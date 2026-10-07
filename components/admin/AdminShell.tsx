"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Session } from "@/lib/auth";

type NavItem = { href: string; label: string; icon: string };
type NavGroup = { label: string; items: NavItem[] };

const GROUPS: Record<string, NavGroup[]> = {
  superadmin: [
    { label: "", items: [{ href: "/admin", label: "Dashboard", icon: "◫" }] },
    {
      label: "CRM",
      items: [
        { href: "/admin/enquiries", label: "Enquiries", icon: "✉" },
        { href: "/admin/customers", label: "Customers", icon: "☺" },
        { href: "/admin/followups", label: "Follow-ups", icon: "⏰" },
        { href: "/admin/bookings", label: "Bookings", icon: "▤" },
      ],
    },
    {
      label: "Schedule",
      items: [{ href: "/admin/calendar", label: "Calendar", icon: "▦" }],
    },
    {
      label: "Services",
      items: [
        { href: "/admin/services", label: "Services", icon: "◎" },
        { href: "/admin/packages", label: "Packages", icon: "₹" },
      ],
    },
    {
      label: "Portfolio",
      items: [{ href: "/admin/portfolio", label: "Photos & Albums", icon: "❖" }],
    },
    {
      label: "Finance",
      items: [
        { href: "/admin/payments", label: "Payments", icon: "₽" },
        { href: "/admin/reports", label: "Revenue Reports", icon: "▲" },
      ],
    },
    {
      label: "Marketing",
      items: [
        { href: "/admin/testimonials", label: "Testimonials", icon: "★" },
        { href: "/admin/coupons", label: "Coupons & Offers", icon: "%" },
        { href: "/admin/whatsapp", label: "WhatsApp Templates", icon: "✆" },
      ],
    },
    {
      label: "Team",
      items: [{ href: "/admin/team", label: "Staff", icon: "☰" }],
    },
    {
      label: "Website",
      items: [
        { href: "/admin/content", label: "Homepage Content", icon: "✎" },
        { href: "/admin/seo", label: "SEO", icon: "◍" },
      ],
    },
    {
      label: "",
      items: [
        { href: "/admin/notifications", label: "Notifications", icon: "◔" },
        { href: "/admin/settings", label: "Settings", icon: "⚙" },
      ],
    },
  ],
  manager: [
    { label: "", items: [{ href: "/admin", label: "Dashboard", icon: "◫" }] },
    {
      label: "CRM",
      items: [
        { href: "/admin/enquiries", label: "Enquiries", icon: "✉" },
        { href: "/admin/customers", label: "Customers", icon: "☺" },
        { href: "/admin/bookings", label: "Bookings", icon: "▤" },
      ],
    },
    { label: "Schedule", items: [{ href: "/admin/calendar", label: "Calendar", icon: "▦" }] },
    {
      label: "Finance",
      items: [{ href: "/admin/payments", label: "Payments", icon: "₽" }],
    },
    {
      label: "",
      items: [
        { href: "/admin/reports", label: "Reports", icon: "▲" },
        { href: "/admin/notifications", label: "Notifications", icon: "◔" },
      ],
    },
  ],
  photographer: [
    { label: "", items: [{ href: "/admin", label: "Dashboard", icon: "◫" }] },
    { label: "My Work", items: [{ href: "/admin/bookings", label: "My Bookings", icon: "▤" }] },
    { label: "Schedule", items: [{ href: "/admin/calendar", label: "Calendar", icon: "▦" }] },
    { label: "", items: [{ href: "/admin/notifications", label: "Notifications", icon: "◔" }] },
  ],
  editor: [
    { label: "", items: [{ href: "/admin", label: "Dashboard", icon: "◫" }] },
    { label: "Portfolio", items: [{ href: "/admin/portfolio", label: "Photos & Albums", icon: "❖" }] },
    { label: "", items: [{ href: "/admin/notifications", label: "Notifications", icon: "◔" }] },
  ],
};

export default function AdminShell({
  session,
  children,
}: {
  session: Session;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    let alive = true;
    const poll = async () => {
      try {
        const res = await fetch("/api/admin/me", { cache: "no-store" });
        if (!res.ok) throw new Error();
        const json = await res.json();
        if (alive) setUnread(json.unread || 0);
      } catch {
        if (alive) router.replace("/admin/login");
      }
    };
    poll();
    const t = setInterval(poll, 45_000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [router, pathname]);

  useEffect(() => setOpen(false), [pathname]);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  };

  const groups = GROUPS[session.role] || GROUPS.manager;
  const initials = session.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  const titleMap: Record<string, { t: string; s: string }> = {
    "/admin": { t: "Dashboard", s: "Your studio at a glance" },
    "/admin/enquiries": { t: "Enquiries", s: "Every lead from the website and WhatsApp" },
    "/admin/customers": { t: "Customers", s: "Your client database" },
    "/admin/followups": { t: "Follow-ups", s: "Leads that need a call today" },
    "/admin/bookings": { t: "Bookings", s: "Confirmed events, amounts and crew" },
    "/admin/calendar": { t: "Event Calendar", s: "All bookings on one calendar" },
    "/admin/services": { t: "Services", s: "What appears on the website" },
    "/admin/packages": { t: "Packages", s: "Pricing plans shown to customers" },
    "/admin/portfolio": { t: "Photos & Albums", s: "Your public portfolio" },
    "/admin/payments": { t: "Payments", s: "Advance, balance and receipts" },
    "/admin/reports": { t: "Reports", s: "Business analytics and exports" },
    "/admin/testimonials": { t: "Testimonials", s: "Client reviews on the website" },
    "/admin/coupons": { t: "Coupons & Offers", s: "Discount codes for quotes" },
    "/admin/whatsapp": { t: "WhatsApp Templates", s: "Ready-to-send message templates" },
    "/admin/team": { t: "Staff", s: "Photographers, videographers and editors" },
    "/admin/content": { t: "Homepage Content", s: "Edit website text without code" },
    "/admin/seo": { t: "SEO", s: "Per-page titles, descriptions and indexing" },
    "/admin/notifications": { t: "Notifications", s: "Everything that happened" },
    "/admin/settings": { t: "Settings", s: "Studio details, policies and admin users" },
  };
  const head = titleMap[pathname] || { t: "Admin", s: "" };

  return (
    <div className="admShell">
      <aside className={`admSide ${open ? "open" : ""}`}>
        <div className="admBrand">
          <b>
            A<span>One</span>
          </b>
          <small>STUDIO ADMIN</small>
        </div>
        {groups.map((g, i) => (
          <div className="admGroup" key={i}>
            {g.label && <div className="admGroupLabel">{g.label}</div>}
            {g.items.map((it) => {
              const active = it.href === "/admin" ? pathname === "/admin" : pathname.startsWith(it.href);
              return (
                <Link key={it.href} href={it.href} className={active ? "active" : ""}>
                  <i>{it.icon}</i> {it.label}
                </Link>
              );
            })}
          </div>
        ))}
        <div className="admSideFoot">
          Logged in as <b style={{ color: "#fff" }}>{session.name}</b>
          <br />
          <Link href="/">← View website</Link>
        </div>
      </aside>

      <div className="admMainWrap">
        <header className="admTop">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="rowBtn admMenuBtn" onClick={() => setOpen(!open)} aria-label="Menu">
              ☰
            </button>
            <div className="admTopTitle">
              <h1>{head.t}</h1>
              <p>{head.s}</p>
            </div>
          </div>
          <div className="admTopActions">
            <Link href="/admin/notifications" className="admBell" aria-label="Notifications">
              ◔
              {unread > 0 && <span className="admBellDot">{unread > 99 ? "99+" : unread}</span>}
            </Link>
            <div className="admUser">
              <span className="admAvatar">{initials}</span>
              <span className="admUserMeta">
                <b>{session.name}</b>
                <small>{session.role}</small>
              </span>
            </div>
            <button className="admLogout" onClick={logout}>
              Logout
            </button>
          </div>
        </header>
        <main className="admMain">{children}</main>
      </div>
    </div>
  );
}
