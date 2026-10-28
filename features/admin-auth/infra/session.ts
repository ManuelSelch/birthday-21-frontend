import { sign, verify } from "jsonwebtoken";
import { SESSION_SECONDS } from "../domain/rules";

export function passwordMatches(value: unknown): boolean {
  return !!process.env.ADMIN_PASSWORD && value === process.env.ADMIN_PASSWORD;
}

export function createSession(): string {
  return sign({ admin: true }, process.env.ADMIN_PASSWORD!, { algorithm: "HS256", expiresIn: SESSION_SECONDS });
}

export function validSession(token?: string): boolean {
  if (!token || !process.env.ADMIN_PASSWORD) return false;
  try {
    const payload = verify(token, process.env.ADMIN_PASSWORD, { algorithms: ["HS256"] });
    return typeof payload === "object" && payload.admin === true;
  } catch {
    return false;
  }
}
