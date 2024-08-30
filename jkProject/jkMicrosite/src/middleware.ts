import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {

  if(request.nextUrl.pathname.startsWith("/google2552bc5256ac1758.html")){
    if(request.cookies.get("accountcode") != "AMARTA_JEWELS"){
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (request.nextUrl.pathname.startsWith("/account")) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (
    request.nextUrl.pathname.startsWith("/sign-in") ||
    request.nextUrl.pathname.startsWith("/sign-up") ||
    request.nextUrl.pathname.startsWith("/forgot-password")
  ) {
    if (request.cookies.get("auth")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  if (request.nextUrl.pathname.startsWith("/recently_view/list")) {
    if (!request.cookies.get("auth")) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }
}

export const config = {
  matcher: [
    "/account",
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/recently_view/list",
    "/google2552bc5256ac1758.html"
  ],
};
