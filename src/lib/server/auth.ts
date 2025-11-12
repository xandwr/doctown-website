import type { SessionUser } from "$lib/types";

/**
 * Validates a session token by checking with the backend
 * Returns user data if valid, null otherwise
 */
export async function validateSession(
  sessionToken: string,
): Promise<SessionUser | null> {
  try {
    const backendUrl =
      process.env.NODE_ENV === "production"
        ? "https://doctown-backend.fly.dev"
        : "http://localhost:3000";

    const response = await fetch(`${backendUrl}/api/v1/users/me`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const userData = await response.json();
    return {
      id: userData.id,
      github_id: userData.github_id,
      username: userData.username,
      avatar_url: userData.avatar_url,
    };
  } catch (error) {
    console.error("Session validation error:", error);
    return null;
  }
}
