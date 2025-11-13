import { json, error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ cookies }) => {
  const sessionToken = cookies.get("session_token");

  if (!sessionToken) {
    throw error(401, "Not authenticated");
  }

  const backendUrl =
    process.env.NODE_ENV === "production"
      ? "https://doctown-backend.fly.dev"
      : "http://localhost:3000";

  try {
    const response = await fetch(`${backendUrl}/api/v1/repositories`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    });

    if (!response.ok) {
      throw error(response.status, "Failed to fetch repositories");
    }

    const repositories = await response.json();
    return json(repositories);
  } catch (err) {
    console.error("Error fetching repositories:", err);
    throw error(500, "Failed to fetch repositories from GitHub");
  }
};
