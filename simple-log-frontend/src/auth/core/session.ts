import { redis } from "@/lib/redisClient";
import crypto from "crypto";
import * as jose from "jose";

import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { z } from "zod";
const sessionSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
});
export type UserSession = z.infer<typeof sessionSchema>;

const SESSION_EXPIRY_TIME = 1000 * 60 * 60 * 24 * 5;
const COOKIE_SESSION_KEY = "session";
export const createUserSession = (
  user: UserSession,
  cookie: ReadonlyRequestCookies
) => {
  const session = sessionSchema.parse(user);
  const sessionId = crypto.randomBytes(64).toString("hex").normalize();
  redis.set(`sessionId:${sessionId}`, session, {
    ex: SESSION_EXPIRY_TIME / 1000,
  });
  setCookie(sessionId, cookie);
};

export const getUserFromSession = (cookies: ReadonlyRequestCookies) => {
  const session = cookies.get(COOKIE_SESSION_KEY)?.value;
  if (!session) return null;

  return getUserSessionById(session);
};

export const getUserSessionById = async (sessionId: string) => {
  const rawUser = await redis.get(`sessionId:${sessionId}`);
  const { success, data: user } = sessionSchema.safeParse(rawUser);
  return success ? user : null;
};

export async function removeUserFromSession(cookies: ReadonlyRequestCookies) {
  const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value;
  console.log(sessionId);
  if (sessionId == null) return null;

  await redis.del(`session:${sessionId}`);
  cookies.delete(COOKIE_SESSION_KEY);
}

export async function updateUserSessionExpiration(
  cookies: ReadonlyRequestCookies
) {
  const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value;
  if (sessionId == null) return null;

  const user = await getUserSessionById(sessionId);
  if (user == null) return;

  await redis.set(`session:${sessionId}`, user, {
    ex: SESSION_EXPIRY_TIME / 1000,
  });
  setCookie(sessionId, cookies);
}

const setCookie = (sessionId: string, cookies: ReadonlyRequestCookies) => {
  cookies.set(COOKIE_SESSION_KEY, sessionId, {
    secure: true,
    httpOnly: true,
    sameSite: "lax",
    expires: Date.now() + SESSION_EXPIRY_TIME,
  });
};
