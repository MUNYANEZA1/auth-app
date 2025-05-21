// Next.js middleware for route protection
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getTokenFromRequest, verifyToken } from "./lib/authUtils";

// Middleware function that runs before requests
export function middleware(request: NextRequest) {
  // Get the path from the request
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = path === "/auth/login" || path === "/auth/register";

  // Get the token from the request
  const token = getTokenFromRequest(request);

  // If the path is a public path and the user is authenticated, redirect to welcome page
  if (isPublicPath && token) {
    // Verify the token
    const payload = verifyToken(token);

    // If token is valid, redirect to welcome page
    if (payload) {
      return NextResponse.redirect(new URL("/main/welcome", request.url));
    }
  }

  // If the path is not a public path and the user is not authenticated, redirect to login page
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Continue with the request
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: ["/auth/:path*", "/main/:path*"],
};
