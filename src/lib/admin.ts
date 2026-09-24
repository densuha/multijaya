import { cookies } from "next/headers";
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "mj_admin";
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET ?? "multijaya-local-session";

function hashPassword(password: string, salt = randomBytes(16).toString("hex")) {
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string) {
  const [salt, expected] = stored.split(":");
  if (!salt || !expected) return false;
  const actual = scryptSync(password, salt, 64);
  const expectedBuffer = Buffer.from(expected, "hex");
  return expectedBuffer.length === actual.length && timingSafeEqual(actual, expectedBuffer);
}

function signSession(username: string) {
  const payload = Buffer.from(`${username}:${Date.now() + 1000 * 60 * 60 * 12}`).toString("base64url");
  const signature = createHmac("sha256", SESSION_SECRET).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

function readSession(value: string) {
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return null;
  const expected = createHmac("sha256", SESSION_SECRET).update(payload).digest("base64url");
  if (signature !== expected) return null;
  const [username, expiresAt] = Buffer.from(payload, "base64url").toString().split(":");
  return username && Number(expiresAt) > Date.now() ? username : null;
}

export async function ensureAdminAccount() {
  const username = process.env.ADMIN_USERNAME ?? "admin";
  const password = process.env.ADMIN_PASSWORD ?? "admin123";
  const existing = await prisma.adminUser.findUnique({ where: { username } });
  if (existing) return existing;
  return prisma.adminUser.create({ data: { username, passwordHash: hashPassword(password), role: "admin" } });
}

export async function isAdminLoggedIn() {
  const jar = await cookies();
  const username = readSession(jar.get(COOKIE_NAME)?.value ?? "");
  if (!username) return false;
  return Boolean(await prisma.adminUser.findUnique({ where: { username }, select: { id: true } }));
}

export async function setAdminSession(username: string) {
  const jar = await cookies();
  jar.set(COOKIE_NAME, signSession(username), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function clearAdminSession() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export function checkAdminPassword(password: string) {
  return password === process.env.ADMIN_PASSWORD;
}

export async function authenticateAdmin(username: string, password: string) {
  const account = await ensureAdminAccount();
  const matchingAccount = await prisma.adminUser.findUnique({ where: { username: username.trim() } });
  if (!matchingAccount || !verifyPassword(password, matchingAccount.passwordHash)) return null;
  return matchingAccount;
}

export async function getCurrentAdmin() {
  const jar = await cookies();
  const username = readSession(jar.get(COOKIE_NAME)?.value ?? "");
  if (!username) return null;
  return prisma.adminUser.findUnique({ where: { username }, select: { id: true, username: true, role: true } });
}

export { hashPassword };
