import { NextRequest, NextResponse } from "next/server";
import { deleteFromCollection, getCollection, updateInCollection } from "@/lib/db";
import { getSession, hashPassword } from "@/lib/auth";
import { canAccess } from "@/lib/permissions";

/** PUT (update) and DELETE (remove) for a single row of any collection. */

const SECTION_OF: Record<string, string> = {
  enquiries: "enquiries",
  customers: "customers",
  bookings: "bookings",
  payments: "payments",
  staff: "team",
  services: "services",
  packages: "packages",
  albums: "portfolio",
  testimonials: "testimonials",
  coupons: "coupons",
  notifications: "notifications",
  templates: "whatsapp",
  adminusers: "settings",
};

type Row = { id?: string; createdAt?: string; [k: string]: unknown };

async function guard(collection: string) {
  const session = await getSession();
  if (!session) return { error: NextResponse.json({ error: "unauthenticated" }, { status: 401 }) };
  const section = SECTION_OF[collection];
  if (!section || !canAccess(session.role, section)) {
    return { error: NextResponse.json({ error: "forbidden" }, { status: 403 }) };
  }
  return { session };
}

export async function PUT(req: NextRequest, ctx: { params: Promise<{ collection: string; id: string }> }) {
  const { collection, id } = await ctx.params;
  const g = await guard(collection);
  if (g.error) return g.error;

  const patch = (await req.json()) as Row;
  delete patch.id;
  delete patch.createdAt;

  // Admin user updates: re-hash password if changed, never demote self
  if (collection === "adminusers") {
    const p = patch as unknown as { password?: string; role?: string };
    if (p.password) {
      if (p.password.length < 4) return NextResponse.json({ error: "Password must be at least 4 characters." }, { status: 400 });
      const { salt, hash } = hashPassword(p.password);
      (patch as Record<string, unknown>).salt = salt;
      (patch as Record<string, unknown>).passHash = hash;
    }
    delete (patch as Record<string, unknown>).password;
    if (id === g.session!.userId && p.role && p.role !== "superadmin") {
      return NextResponse.json({ error: "You cannot change your own role." }, { status: 400 });
    }
  }

  const updated = await updateInCollection(collection as never, id, patch as never);
  if (!updated) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ item: updated });
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ collection: string; id: string }> }) {
  const { collection, id } = await ctx.params;
  const g = await guard(collection);
  if (g.error) return g.error;

  if (collection === "adminusers") {
    if (id === g.session!.userId) {
      return NextResponse.json({ error: "You cannot delete your own account." }, { status: 400 });
    }
    const users = await getCollection<{ id: string; role: string }>("adminusers");
    const target = users.find((u) => u.id === id);
    if (target?.role === "superadmin" && users.filter((u) => u.role === "superadmin").length <= 1) {
      return NextResponse.json({ error: "At least one super admin must remain." }, { status: 400 });
    }
  }

  const ok = await deleteFromCollection(collection as never, id);
  if (!ok) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
