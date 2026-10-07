import { NextRequest, NextResponse } from "next/server";
import { col, getCollection, ensureSeed, newId, type AdminUser } from "@/lib/db";
import { hashPassword, setSessionCookie, verifyPassword } from "@/lib/auth";

/**
 * POST /api/admin/login
 * - First run (no admin users yet) with `name` in the body: creates the owner
 *   (super admin) account — one-time setup.
 * - Otherwise: verifies mobile + password and starts a session.
 */
export async function POST(req: NextRequest) {
  try {
    await ensureSeed();
    const body = (await req.json()) as { mobile?: string; password?: string; name?: string };
    const mobile = (body.mobile || "").replace(/\D/g, "");
    const password = body.password || "";

    if (mobile.length < 10 || password.length < 4) {
      return NextResponse.json({ error: "Enter a valid 10+ digit mobile number and a password of 4+ characters." }, { status: 400 });
    }

    const users = await col("adminusers");
    const existing = await users.countDocuments({});

    // ── One-time setup: create the first super admin ──
    if (existing === 0) {
      const { salt, hash } = hashPassword(password);
      const user: AdminUser = {
        id: newId(),
        name: (body.name || "Owner").trim(),
        mobile,
        salt,
        passHash: hash,
        role: "superadmin",
        active: true,
        createdAt: new Date().toISOString(),
      };
      await users.insertOne({ ...user });
      await setSessionCookie(user);
      return NextResponse.json({ ok: true, setup: true });
    }

    // ── Normal login ──
    const user = (await users.findOne({ mobile })) as unknown as AdminUser | null;
    if (!user || !user.active || !verifyPassword(password, user.salt, user.passHash)) {
      return NextResponse.json({ error: "Wrong mobile number or password." }, { status: 401 });
    }
    await setSessionCookie(user);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Login failed" }, { status: 500 });
  }
}

/** GET — reports whether first-run setup is needed (no admin users yet). */
export async function GET() {
  try {
    const users = await getCollection<AdminUser>("adminusers");
    return NextResponse.json({ needsSetup: users.length === 0 });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed", needsSetup: false }, { status: 500 });
  }
}
