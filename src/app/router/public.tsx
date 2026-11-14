import { RouteObject } from "react-router";

/**
 * Public routes configuration
 * These routes are accessible without authentication
 * Includes error pages, authentication pages, and other public content
 */
const publicRoutes: RouteObject = {
  id: "public",
  children: [
    {
      // Admin app se token handoff ke liye
      path: "auth-callback",
      lazy: async () => ({
        Component: (await import("@/app/pages/Auth/AuthCallback")).default,
      }),
    },
  ],
};

export { publicRoutes };