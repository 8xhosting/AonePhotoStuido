import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { col } from "@/lib/db";

/** GET /api/admin/me — session info + unread notification count for the topbar. */
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  let unread = 0;
  try {
    unread = await (await col("notifications")).countDocuments({ read: false });
  } catch {
    /* non-fatal */
  }
  return NextResponse.json({ session, unread });
}
