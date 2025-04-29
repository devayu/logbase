import {
  getUserFromSession,
  updateUserSessionExpiration,
} from "@/auth/core/session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protected routes that require authentication
export const protectedRoutes = ["/projects", "/dashboard"];

export async function middleware(request: NextRequest) {
  try {
    // Handle authentication middleware
    const authResponse = await middlewareAuth(request);
    if (authResponse) {
      return authResponse;
    }

    // Update session expiration
    await updateUserSessionExpiration(await cookies());

    // Continue with the request
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
}

async function middlewareAuth(request: NextRequest) {
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    const user = await getUserFromSession(await cookies());
    if (!user) {
      return NextResponse.redirect(new URL(`/sign-in`, request.url));
    }
  }
  return null;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
    "/projects/:path*",
    "/dashboard/:path*",
    "/settings/:path*",
    "/profile/:path*",
  ],
};
