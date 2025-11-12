import { PUBLIC_BACKEND_URL } from "$env/static/public";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch }) => {
  try {
    const response = await fetch(`${PUBLIC_BACKEND_URL}/api/v1/docpacks?limit=50`);

    if (!response.ok) {
      console.error("Failed to fetch docpacks:", response.status);
      return {
        docpacks: [],
        total: 0,
        error: "Failed to load docpacks"
      };
    }

    const data = await response.json();

    return {
      docpacks: data.docpacks || [],
      total: data.total || 0,
    };
  } catch (error) {
    console.error("Error fetching docpacks:", error);
    return {
      docpacks: [],
      total: 0,
      error: "Failed to load docpacks"
    };
  }
};
