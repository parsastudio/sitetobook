import "server-only";
import { cookies } from "next/headers";
import {
  decryptSessionToken,
  encryptSessionToken,
  SessionPayload,
} from "@/lib/security";

export async function getOwnerSession(
  slug: string
): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const normalizedSlug = slug.toLowerCase().trim();
  const token = cookieStore.get(`owner_session_${normalizedSlug}`)?.value;
  if (!token) return null;
  const session = decryptSessionToken(token);
  if (
    !session ||
    session.slug !== normalizedSlug ||
    session.role !== "owner"
  ) {
    return null;
  }
  return session;
}

export async function setOwnerSession(slug: string): Promise<void> {
  const normalizedSlug = slug.toLowerCase().trim();
  const token = encryptSessionToken({
    slug: normalizedSlug,
    role: "owner",
    issuedAt: Date.now(),
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
  });

  const cookieStore = await cookies();
  cookieStore.set(`owner_session_${normalizedSlug}`, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  });
}

export async function clearOwnerSession(slug: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(`owner_session_${slug.toLowerCase().trim()}`);
}

export async function getAdminSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  if (!token) return null;
  const session = decryptSessionToken(token);
  if (!session || session.role !== "master-admin") {
    return null;
  }
  return session;
}

export async function setAdminSession(): Promise<void> {
  const token = encryptSessionToken({
    slug: "system",
    role: "master-admin",
    issuedAt: Date.now(),
    expiresAt: Date.now() + 12 * 60 * 60 * 1000,
  });

  const cookieStore = await cookies();
  cookieStore.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 12 * 60 * 60,
    path: "/",
  });
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
}
