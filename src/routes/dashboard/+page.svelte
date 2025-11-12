<script lang="ts">
    import type { SessionUser } from "$lib/types";

    interface PageData {
        user?: SessionUser | null;
    }

    let { data }: { data: PageData } = $props();
</script>

<main class="min-h-screen bg-black">
    <div class="max-w-[1200px] mx-auto px-5 md:px-8 py-16">
        {#if data.user}
            <div class="mb-8">
                <h1 class="text-4xl font-normal mb-4 text-white">
                    My Docpacks
                </h1>
                <p class="text-lg text-neutral-400">
                    Welcome back, <span class="text-white"
                        >{data.user.username}</span
                    >
                </p>
            </div>

            <div class="border border-neutral-800 rounded-lg p-12 text-center">
                <div class="mb-6">
                    <svg
                        class="w-16 h-16 mx-auto text-neutral-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                    </svg>
                </div>
                <h2 class="text-2xl font-normal mb-3 text-white">
                    No docpacks yet
                </h2>
                <p class="text-neutral-500 mb-6">
                    Upload your first docpack to get started.<br />
                    Coming soon: AI-powered documentation generation from GitHub
                    repos.
                </p>
                <button
                    disabled
                    class="px-6 py-3 bg-neutral-800 text-neutral-600 rounded cursor-not-allowed"
                >
                    Upload Docpack (Coming Soon)
                </button>
            </div>
        {:else}
            <div class="text-center py-20">
                <h1 class="text-3xl font-normal mb-4 text-white">
                    Please log in
                </h1>
                <p class="text-neutral-500 mb-8">
                    You need to be logged in to view your docpacks.
                </p>
                <a
                    href="/auth/login"
                    class="inline-block px-6 py-3 bg-white text-black rounded hover:bg-neutral-200 transition-colors no-underline"
                >
                    Login with GitHub
                </a>
            </div>
        {/if}
    </div>
</main>
