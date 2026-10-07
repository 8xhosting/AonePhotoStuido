import type { Role } from "./types";

/**
 * Which admin sections each role can see. The sidebar filters on this and
 * every admin API route re-checks it server-side.
 */
export const ROLE_SECTIONS: Record<Role, string[]> = {
  superadmin: [
    "dashboard", "enquiries", "customers", "bookings", "calendar",
    "services", "packages", "portfolio", "testimonials", "payments",
    "team", "coupons", "content", "whatsapp", "seo", "reports",
    "notifications", "settings",
  ],
  manager: [
    "dashboard", "enquiries", "customers", "bookings", "calendar",
    "payments", "whatsapp", "reports", "notifications",
  ],
  photographer: ["dashboard", "bookings", "calendar", "notifications"],
  editor: ["dashboard", "portfolio", "notifications"],
};

export function canAccess(role: Role, section: string): boolean {
  return ROLE_SECTIONS[role]?.includes(section) ?? false;
}
