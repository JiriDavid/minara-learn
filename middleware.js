import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Create a route matcher to check public routes
const isPublicRoute = createRouteMatcher([
  "/",
  "/courses",
  "/courses/(.*)",
  "/api/courses(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
]);

export default clerkMiddleware({
  // Set publicRoutes using a matcher function
  publicRoutes: (req) => isPublicRoute(req.url),
  // Ignore webhook routes
  ignoredRoutes: ["/api/webhooks(.*)"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
