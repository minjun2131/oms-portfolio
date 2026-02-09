import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * 미들웨어 - 인증 및 라우트 보호
 */
export function middleware(request: NextRequest) {
  // 인증이 필요한 경로
  const protectedPaths = ["/dashboard", "/products", "/orders", "/customers", "/inventory"];
  // 인증 페이지 (로그인 상태에서 접근 불가)
  const authPaths = ["/login", "/register"];

  const { pathname } = request.nextUrl;

  // TODO: 실제 인증 로직 구현
  // const token = request.cookies.get("auth-token");
  // const isAuthenticated = Boolean(token);

  // 임시: 항상 인증되지 않은 상태로 처리
  const isAuthenticated = false;

  // 보호된 경로에 비인증 접근 시 로그인 페이지로 리다이렉트
  if (protectedPaths.some((path) => pathname.startsWith(path)) && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 인증 페이지에 인증된 사용자 접근 시 대시보드로 리다이렉트
  if (authPaths.some((path) => pathname.startsWith(path)) && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
