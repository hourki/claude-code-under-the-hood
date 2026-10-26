import { timingSafeEqual } from "node:crypto";

// True only for the header "Bearer <token>". timingSafeEqual avoids leaking the token through response timing.
export function hasValidToken(header: string | null, token: string): boolean {
  const expected = Buffer.from(`Bearer ${token}`);
  const given = Buffer.from(header ?? "");
  return given.length === expected.length && timingSafeEqual(given, expected);
}
