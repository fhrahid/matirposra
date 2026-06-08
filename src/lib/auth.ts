import crypto from "crypto";
import { cookies } from "next/headers";
import dbConnect from "./mongodb";
import User, { IUser } from "@/models/User";

const SESSION_COOKIE = "mp_session";
const AUTH_SECRET = process.env.AUTH_SECRET || "matir-poshara-dev-secret";

/* ----------------------------- Password hashing ---------------------------- */

// Hash a password using scrypt (built into Node, no external dependency).
// Stored as "salt:derivedKey", both hex encoded.
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, key] = stored.split(":");
  if (!salt || !key) return false;
  const derived = crypto.scryptSync(password, salt, 64);
  const keyBuffer = Buffer.from(key, "hex");
  if (keyBuffer.length !== derived.length) return false;
  return crypto.timingSafeEqual(keyBuffer, derived);
}

/* ------------------------------ Session tokens ----------------------------- */

// A session token is "<userId>.<hmac>" where hmac signs the userId. This keeps
// the cookie tamper-proof without needing a server-side session store.
function sign(value: string): string {
  return crypto.createHmac("sha256", AUTH_SECRET).update(value).digest("hex");
}

export function createSessionToken(userId: string): string {
  return `${userId}.${sign(userId)}`;
}

function verifySessionToken(token: string): string | null {
  const [userId, signature] = token.split(".");
  if (!userId || !signature) return null;
  const expected = sign(userId);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  return userId;
}

/* ------------------------------ Cookie helpers ----------------------------- */

export async function setSessionCookie(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, createSessionToken(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

// Returns the currently logged-in user (without the password hash) or null.
export async function getCurrentUser(): Promise<Omit<IUser, "passwordHash"> | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const userId = verifySessionToken(token);
  if (!userId) return null;

  try {
    await dbConnect();
    const user = await User.findById(userId).select("-passwordHash").lean();
    return user as unknown as Omit<IUser, "passwordHash"> | null;
  } catch {
    return null;
  }
}
