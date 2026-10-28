export const SESSION_SECONDS = 12 * 60 * 60;
export const SESSION_COOKIE = "birthday_admin";

export type AuthConfig = {
  passwordHash: string;
  sessionSecret: string;
  origin: string;
  secure: boolean;
};

export function safeAdminDestination(value?: string | null): string {
  const fallback = "/admin/guests";
  if (!value || /[\u0000-\u0020\\#]/.test(value)) return fallback;

  try {
    const url = new URL(value, "https://admin.invalid");
    if (
      url.origin !== "https://admin.invalid" ||
      url.pathname + url.search !== value ||
      !/^\/admin(?:\/[a-zA-Z0-9_-]+)*\/?$/.test(url.pathname) ||
      /^\/admin\/login(?:\/|$)/.test(url.pathname)
    ) return fallback;

    return value;
  } catch {
    return fallback;
  }
}
