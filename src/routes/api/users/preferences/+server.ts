import { json, error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { PUBLIC_BACKEND_URL } from "$env/static/public";

export const PATCH: RequestHandler = async ({ cookies, request }) => {
  const sessionToken = cookies.get("session_token");

  if (!sessionToken) {
    throw error(401, "Not authenticated");
  }

  try {
    const body = await request.json();

    const response = await fetch(
      `${PUBLIC_BACKEND_URL}/api/v1/users/preferences`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify(body),
      },
    );

    if (!response.ok) {
      throw error(response.status, "Failed to update preferences");
    }

    const result = await response.json();
    return json(result);
  } catch (err) {
    if (err && typeof err === "object" && "status" in err) {
      throw err;
    }
    console.error("Error updating preferences:", err);
    throw error(500, "Failed to update preferences");
  }
};
