import { getMedia } from "@/lib/db";

/** GET /api/media/[key] — serves uploaded images out of MongoDB with long-lived caching. */
export async function GET(_req: Request, ctx: { params: Promise<{ key: string }> }) {
  const { key } = await ctx.params;
  const media = await getMedia(key);
  if (!media) return new Response("Not found", { status: 404 });

  const bytes = new Uint8Array(Buffer.from(media.data.buffer as unknown as ArrayBuffer));
  return new Response(bytes, {
    headers: {
      "Content-Type": media.mime,
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Length": String(bytes.byteLength),
    },
  });
}
