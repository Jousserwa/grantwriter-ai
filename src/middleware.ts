import { auth } from "@/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // Paths that should always be accessible
  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isPublicRoute = ["/", "/auth/signin"].includes(nextUrl.pathname);
  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard");

  // 1. Allow all Auth API routes (sign-in, sign-out, session, etc.)
  if (isApiAuthRoute) {
    return;
  }

  // 2. Protect dashboard routes - redirect to signin if not logged in
  if (isDashboardRoute && !isLoggedIn) {
    // Redirect to the default Auth.js signin page
    return Response.redirect(new URL("/api/auth/signin", nextUrl));
  }

  return;
});

// Configure which paths the middleware should run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
