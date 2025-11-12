import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import {
  GITHUB_APP_CLIENT_ID,
  GITHUB_APP_CALLBACK_URL_BASE,
} from "$env/static/private";

export const GET: RequestHandler = async ({ cookies }) => {
  // Generate random state for CSRF protection
  const state = crypto.randomUUID();

  // GitHub OAuth scopes: read:user (profile) and repo (repository access)
  const scopes = "read:user repo";

  const githubAuthUrl = new URL("https://github.com/login/oauth/authorize");
  githubAuthUrl.searchParams.set("client_id", GITHUB_APP_CLIENT_ID);
  githubAuthUrl.searchParams.set("redirect_uri", GITHUB_APP_CALLBACK_URL_BASE);
  githubAuthUrl.searchParams.set("scope", scopes);
  githubAuthUrl.searchParams.set("state", state);

  // Store state in cookie for validation in callback
  cookies.set("oauth_state", state, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: false, // Set to true in production with HTTPS
    maxAge: 600, // 10 minutes
  });

  throw redirect(302, githubAuthUrl.toString());
};
