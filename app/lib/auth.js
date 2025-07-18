import { cookies, headers } from "next/headers";
import { clerkClient } from "@clerk/nextjs/server";

/**
 * Get the current Clerk authentication session and user ID
 * This is a server-side utility that can be used in API routes
 * @returns {Object} Object containing userId and sessionId
 */
export async function auth() {
  const headersList = headers();
  const cookieStore = cookies();

  // Get the Clerk session token from the request cookies
  const sessionToken = cookieStore.get("__session")?.value;

  if (!sessionToken) {
    return { userId: null, sessionId: null };
  }

  try {
    // Verify the session token and get the user ID
    const session = await clerkClient.sessions.verifyToken(sessionToken);

    if (!session) {
      return { userId: null, sessionId: null };
    }

    return {
      userId: session.userId,
      sessionId: session.id,
    };
  } catch (error) {
    console.error("Error verifying auth session:", error);
    return { userId: null, sessionId: null };
  }
}

/**
 * Get the current Clerk user with full profile
 * This is a server-side utility that can be used in API routes
 * @returns {Object|null} The user object or null if not authenticated
 */
export async function getCurrentUser() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  try {
    const user = await clerkClient.users.getUser(userId);
    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

/**
 * Check if the current user has a specific role
 * This should be used with your database user record, not the Clerk user
 * @param {string} requiredRole The role to check for (e.g., 'admin', 'instructor')
 * @param {Object} dbUser The user object from your database
 * @returns {boolean} Whether the user has the required role
 */
export function hasRole(requiredRole, dbUser) {
  if (!dbUser || !dbUser.role) {
    return false;
  }

  return dbUser.role === requiredRole;
}
