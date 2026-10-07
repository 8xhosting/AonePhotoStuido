import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { col } from "@/lib/db";

/** POST /api/admin/notifications-read — mark all notifications as read. */
export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  try {
    await (await col("notifications")).updateMany({ read: false }, { $set: { read: true } });
  } catch {
    /* best effort */
  }
  return NextResponse.json({ ok: true });
}
