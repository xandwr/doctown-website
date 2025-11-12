import { json, error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { PUBLIC_BACKEND_URL } from "$env/static/public";

export const PATCH: RequestHandler = async ({ params, cookies, request }) => {
  const sessionToken = cookies.get("session_token");

  if (!sessionToken) {
    throw error(401, "Not authenticated");
  }

  try {
    const body = await request.json();

    const response = await fetch(
      `${PUBLIC_BACKEND_URL}/api/v1/docpacks/id/${params.id}`,
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
      if (response.status === 404) {
        throw error(404, "Docpack not found");
      }
      if (response.status === 403) {
        throw error(403, "You don't have permission to update this docpack");
      }
      throw error(response.status, "Failed to update docpack");
    }

    const docpack = await response.json();
    return json(docpack);
  } catch (err) {
    if (err && typeof err === "object" && "status" in err) {
      throw err;
    }
    console.error("Error updating docpack:", err);
    throw error(500, "Failed to update docpack");
  }
};

export const DELETE: RequestHandler = async ({ params, cookies }) => {
  const sessionToken = cookies.get("session_token");

  if (!sessionToken) {
    throw error(401, "Not authenticated");
  }

  try {
    const response = await fetch(
      `${PUBLIC_BACKEND_URL}/api/v1/docpacks/id/${params.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      },
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw error(404, "Docpack not found");
      }
      if (response.status === 403) {
        throw error(403, "You don't have permission to delete this docpack");
      }
      throw error(response.status, "Failed to delete docpack");
    }

    return json({ success: true });
  } catch (err) {
    if (err && typeof err === "object" && "status" in err) {
      throw err;
    }
    console.error("Error deleting docpack:", err);
    throw error(500, "Failed to delete docpack");
  }
};
