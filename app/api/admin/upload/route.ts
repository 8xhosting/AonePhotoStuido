import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { putMedia } from "@/lib/db";

const MAX_BYTES = 4 * 1024 * 1024; // 4MB per image
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif", "image/svg+xml"];

/** POST /api/admin/upload — multipart image upload, stored in MongoDB, returns the media URL. */
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: `Unsupported type: ${file.type}. Use JPG/PNG/WebP/AVIF/GIF/SVG.` }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image is larger than 4MB." }, { status: 400 });
  }

  const safe = file.name.replace(/[^a-z0-9.\-_]/gi, "-").slice(-40) || "upload";
  const key = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${safe}`;
  const bytes = new Uint8Array(await file.arrayBuffer());
  await putMedia(key, file.type, bytes);

  return NextResponse.json({ url: `/api/media/${key}` });
}
