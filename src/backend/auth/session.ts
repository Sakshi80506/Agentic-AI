import { session } from "@descope/nextjs-sdk/server";
import { findOrCreateUser, getUserByDescopeId } from "@/backend/db/users";
import { User, UserPreference } from "@prisma/client";

export type AuthenticatedUserWithPreferences = User & {
  preferences: UserPreference | null;
};

/**
 * Server-side helper that extracts the authenticated Descope session,
 * verifies the JWT token from cookies, and syncs/returns the PostgreSQL User.
 *
 * Enforces user-level security: all API handlers use this to get the verified userId.
 */
export async function getAuthenticatedUser(): Promise<AuthenticatedUserWithPreferences | null> {
  const projectId = process.env.NEXT_PUBLIC_DESCOPE_PROJECT_ID;

  if (!projectId) {
    // Descope Project ID is not yet configured in .env.local
    return null;
  }

  try {
    const authInfo = await session();

    if (!authInfo || !authInfo.token || !authInfo.token.sub) {
      return null;
    }

    const descopeUserId = authInfo.token.sub;
    const tokenClaims = authInfo.token as Record<string, any>;

    const email = tokenClaims.email || `${descopeUserId}@user.descope`;
    const name = tokenClaims.name || tokenClaims.given_name || "User";
    const profileImage = tokenClaims.picture || null;

    // Check if user already exists in PostgreSQL
    const existingUser = await getUserByDescopeId(descopeUserId);
    if (existingUser) {
      return existingUser;
    }

    // Provision new user in PostgreSQL
    return await findOrCreateUser({
      descopeUserId,
      email,
      name,
      profileImage,
    });
  } catch (error) {
    console.error("Authentication error in getAuthenticatedUser:", error);
    return null;
  }
}

