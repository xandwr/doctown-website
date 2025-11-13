import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { Docpack } from "$lib/types";

export const load: PageServerLoad = async ({ params, cookies }) => {
  const sessionToken = cookies.get("session_token");

  if (!sessionToken) {
    throw error(401, "Not authenticated");
  }

  const backendUrl =
    process.env.NODE_ENV === "production"
      ? "https://doctown-backend.fly.dev"
      : "http://localhost:3000";

  try {
    const response = await fetch(
      `${backendUrl}/api/v1/docpacks/id/${params.id}`,
      {
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
        throw error(403, "You don't have permission to view this docpack");
      }
      throw error(response.status, "Failed to load docpack");
    }

    const docpack: Docpack = await response.json();

    return {
      docpack,
    };
  } catch (err) {
    if (err && typeof err === "object" && "status" in err) {
      throw err;
    }
    console.error("Error loading docpack:", err);
    throw error(500, "Failed to load docpack");
  }
};
