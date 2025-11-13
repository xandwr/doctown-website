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
    const response = await fetch(`${backendUrl}/api/v1/docpacks/me`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    });

    if (!response.ok) {
      throw error(response.status, "Failed to fetch docpacks");
    }

    const docpacks = await response.json();
    return json(docpacks);
  } catch (err) {
    console.error("Error fetching docpacks:", err);
    throw error(500, "Failed to fetch docpacks");
  }
};

export const POST: RequestHandler = async ({ cookies, request }) => {
  const sessionToken = cookies.get("session_token");

  if (!sessionToken) {
    throw error(401, "Not authenticated");
  }

  const backendUrl =
    process.env.NODE_ENV === "production"
      ? "https://doctown-backend.fly.dev"
      : "http://localhost:3000";

  try {
    const body = await request.json();

    const response = await fetch(`${backendUrl}/api/v1/docpacks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      if (response.status === 409) {
        throw error(409, "You already have a docpack for this repository");
      }
      throw error(response.status, "Failed to create docpack");
    }

    const docpack = await response.json();
    return json(docpack);
  } catch (err) {
    if (err && typeof err === "object" && "status" in err) {
      throw err;
    }
    console.error("Error creating docpack:", err);
    throw error(500, "Failed to create docpack");
  }
};
