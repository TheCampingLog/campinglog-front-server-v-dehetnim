import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const userEmail = request.cookies.get("user_email")?.value;
  const { pathname } = request.nextUrl;

  // 로그인 안 됐는데 보호된 페이지(/mypage) 가려고 하면 로그인으로 이동
  if (!userEmail && pathname.startsWith("/mypage")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/mypage/:path*"],
};
