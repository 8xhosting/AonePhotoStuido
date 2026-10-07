import "server-only";
import crypto from "crypto";
import { cookies } from "next/headers";
import { col, getSettings } from "./db";
import type { AdminUser, Role } from "./types";

const COOKIE = "aone_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days
const ITERATIONS = 100_000;

/* -------------------------------------------------------------------------- */
/* Password hashing (PBKDF2-SHA256)                                           */
/* -------------------------------------------------------------------------- */

export function hashPassword(password: string, salt?: string): { salt: string; hash: string } {
  const s = salt ?? crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, s, ITERATIONS, 32, "sha256").toString("hex");
  return { salt: s, hash };
}

export function verifyPassword(password: string, salt: string, expected: string): boolean {
  const { hash } = hashPassword(password, salt);
  const a = Buffer.from(hash, "hex");
  const b = Buffer.from(expected, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/* -------------------------------------------------------------------------- */
/* Signed session tokens (HMAC-SHA256)                                        */
/* -------------------------------------------------------------------------- */

type SessionPayload = { u: string; r: Role; n: string; s?: string; exp: number };

function b64url(input: string | Buffer): string {
  return Buffer.from(input).toString("base64url");
}

async function secret(): Promise<string> {
  const s = await getSettings();
  return s.sessionSecret || "aone-fallback-secret";
}

async function signToken(payload: SessionPayload): Promise<string> {
  const body = b64url(JSON.stringify(payload));
  const mac = crypto.createHmac("sha256", await secret()).update(body).digest("base64url");
  return `${body}.${mac}`;
}

async function verifyToken(token: string): Promise<SessionPayload | null> {
  const [body, mac] = token.split(".");
  if (!body || !mac) return null;
  const expected = crypto.createHmac("sha256", await secret()).update(body).digest("base64url");
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as SessionPayload;
    if (payload.exp < Date.now() / 1000) return null;
    return payload;
  } catch {
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/* Cookie helpers (route handlers may set; server components may read)        */
/* -------------------------------------------------------------------------- */

export async function setSessionCookie(user: AdminUser): Promise<string> {
  const token = await signToken({
    u: user.id,
    r: user.role,
    n: user.name,
    s: user.staffId,
    exp: Math.floor(Date.now() / 1000) + MAX_AGE,
  });
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
  return token;
}

export async function clearSessionCookie(): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}

export type Session = { userId: string; role: Role; name: string; staffId?: string };

/** Read + verify the session from cookies. Returns null when not signed in. */
export async function getSession(): Promise<Session | null> {
  try {
    const jar = await cookies();
    const token = jar.get(COOKIE)?.value;
    if (!token) return null;
    const payload = await verifyToken(token);
    if (!payload) return null;
    // Confirm the user still exists and is active
    const users = await col("adminusers");
    const user = (await users.findOne({ id: payload.u })) as unknown as AdminUser | null;
    if (!user || !user.active) return null;
    return { userId: payload.u, role: payload.r, name: payload.n, staffId: payload.s };
  } catch {
    return null;
  }
}
