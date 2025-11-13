import { json, error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ cookies }) => {
  const sessionToken = cookies.get("session_token");

  if (!sessionToken) {
    console.error("No session token found");
    throw error(401, "Not authenticated");
  }

  const backendUrl =
    process.env.NODE_ENV === "production"
      ? "https://doctown-backend.fly.dev"
      : "http://localhost:3000";

  console.log(`Fetching repositories from ${backendUrl}/api/v1/repositories`);

  try {
    const response = await fetch(`${backendUrl}/api/v1/repositories`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    });

    console.log(`Repository fetch response: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Backend error: ${response.status} - ${errorText}`);
      throw error(response.status, errorText || "Failed to fetch repositories");
    }

    const repositories = await response.json();
    console.log(`Successfully fetched ${repositories.length} repositories`);
    return json(repositories);
  } catch (err) {
    console.error("Error fetching repositories:", err);
    if (err && typeof err === "object" && "status" in err) {
      throw err;
    }
    throw error(500, "Failed to fetch repositories from GitHub");
  }
};
