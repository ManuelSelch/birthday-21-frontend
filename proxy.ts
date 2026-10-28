import { NextRequest, NextResponse } from "next/server";
import { auth, SESSION_COOKIE } from "@/features/admin-auth/server";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (pathname === "/admin/login" || pathname === "/admin/login/" ||
    auth.authenticated(request.cookies.get(SESSION_COOKIE)?.value)) {
    const response = NextResponse.next();
    response.headers.set("Cache-Control", "no-store");
    return response;
  }

  const destination = auth.loginUrl(request);
  const response = NextResponse.redirect(destination);
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export const config = { matcher: ["/admin/:path*"] };
