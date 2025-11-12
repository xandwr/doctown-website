import { redirect, error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import {
  GITHUB_APP_CLIENT_ID,
  GITHUB_APP_CLIENT_SECRET,
} from "$env/static/private";
import type { GitHubTokenResponse, GitHubUser } from "$lib/types";

export const GET: RequestHandler = async ({ url, cookies, fetch }) => {
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies.get("oauth_state");

  // Debug logging
  console.log("OAuth callback received:");
  console.log("  code:", code ? "present" : "missing");
  console.log("  state from URL:", state);
  console.log("  state from cookie:", storedState);

  // Validate state parameter (CSRF protection)
  if (!code) {
    throw error(400, "Missing authorization code");
  }
  if (!state) {
    throw error(400, "Missing state parameter");
  }
  if (!storedState) {
    throw error(400, "Missing state cookie - cookies may be blocked");
  }
  if (state !== storedState) {
    throw error(400, "State mismatch - possible CSRF attack");
  }

  // Clear the state cookie
  cookies.delete("oauth_state", { path: "/" });

  try {
    // Exchange code for access token
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: GITHUB_APP_CLIENT_ID,
          client_secret: GITHUB_APP_CLIENT_SECRET,
          code,
        }),
      },
    );

    if (!tokenResponse.ok) {
      throw error(500, "Failed to exchange code for token");
    }

    const tokenData: GitHubTokenResponse = await tokenResponse.json();

    // Fetch GitHub user profile
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!userResponse.ok) {
      throw error(500, "Failed to fetch GitHub user profile");
    }

    const githubUser: GitHubUser = await userResponse.json();

    // Create or update user in backend
    const backendUrl =
      process.env.NODE_ENV === "production"
        ? "https://doctown-backend.fly.dev"
        : "http://localhost:3000";

    const createUserResponse = await fetch(`${backendUrl}/api/v1/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        github_id: githubUser.id,
        username: githubUser.login,
        avatar_url: githubUser.avatar_url,
        access_token: tokenData.access_token,
      }),
    });

    if (!createUserResponse.ok) {
      console.error("Failed to create/update user in backend");
      // For now, continue anyway - we'll handle this better later
    }

    const userData = await createUserResponse.json();
    const sessionToken = userData.session_token || crypto.randomUUID();

    // Set session cookie
    cookies.set("session_token", sessionToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    // Redirect to homepage
    throw redirect(302, "/");
  } catch (err) {
    // Don't catch redirect exceptions - SvelteKit redirects are special objects
    if (
      err &&
      typeof err === "object" &&
      "status" in err &&
      "location" in err
    ) {
      throw err;
    }
    console.error("OAuth callback error:", err);
    throw error(500, "Authentication failed");
  }
};
