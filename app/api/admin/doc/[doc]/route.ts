import { NextRequest, NextResponse } from "next/server";
import { getDoc, saveDoc } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { canAccess } from "@/lib/permissions";

/**
 * GET/PUT /api/admin/doc/[doc] — singleton documents: settings, content, seo.
 * settings/content/seo are super-admin only.
 */
const SECTIONS: Record<string, string> = { settings: "settings", content: "content", seo: "seo" };

async function guard(doc: string) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  const section = SECTIONS[doc];
  if (!section || !canAccess(session.role, section)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  return null;
}

export async function GET(_req: NextRequest, ctx: { params: Promise<{ doc: string }> }) {
  const { doc } = await ctx.params;
  const denied = await guard(doc);
  if (denied) return denied;

  const fallbacks: Record<string, object> = {
    settings: {},
    content: {
      heroEyebrow: "Capture Your Moments",
      heroTitle: "A ONE",
      heroTitleAccent: "PHOTO STUDIO",
      heroScript: "We Frame Your Memories",
      heroText:
        "Professional photography & videography for weddings, pre-weddings, birthdays, new born shoots, events and cinematic stories.",
      heroImage: "/images/studio-poster.jpeg",
      aboutTitle: "A One Photo Studio",
      aboutText:
        "We specialize in wedding, pre-wedding, candid, birthday, new born, event and cinematic shoots. Our passion is to capture real emotions and turn them into beautiful memories.",
      aboutImage: "/images/studio-wall.jpeg",
      contactNote: "Book your session or talk to the studio today.",
    },
    seo: { pages: {}, robots: "index" },
  };
  const value = await getDoc<Record<string, unknown>>(doc as never, (fallbacks[doc] ?? {}) as Record<string, unknown>);
  return NextResponse.json({ value });
}

export async function PUT(req: NextRequest, ctx: { params: Promise<{ doc: string }> }) {
  const { doc } = await ctx.params;
  const denied = await guard(doc);
  if (denied) return denied;

  const body = (await req.json()) as { value: Record<string, unknown> };
  await saveDoc(doc as never, body.value ?? {});
  return NextResponse.json({ ok: true });
}
