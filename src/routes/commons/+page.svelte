<script lang="ts">
    import type { SessionUser } from "$lib/types";

    interface Docpack {
        id: number;
        name: string;
        version: string;
        ecosystem: string;
        summary?: string;
        description?: string;
        homepage?: string;
        tags: string[];
        author?: string;
        license?: string;
        downloads: number;
        published_at: string;
    }

    interface PageData {
        user?: SessionUser | null;
        docpacks: Docpack[];
        total: number;
        error?: string;
    }

    let { data }: { data: PageData } = $props();

    function formatDate(isoString: string): string {
        const date = new Date(isoString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    }

    function formatDownloads(count: number): string {
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}M`;
        } else if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}K`;
        }
        return count.toString();
    }
</script>

<main class="min-h-screen bg-black">
    <div class="max-w-[1200px] mx-auto px-5 md:px-8 py-16">
        <div class="mb-8">
            <h1 class="text-4xl font-normal mb-4 text-white">Commons</h1>
            <p class="text-lg text-neutral-400">
                Explore public docpacks from the community
            </p>
            {#if data.total > 0}
                <p class="text-sm text-neutral-600 mt-2">
                    {data.total}
                    {data.total === 1 ? "docpack" : "docpacks"} available
                </p>
            {/if}
        </div>

        {#if data.error}
            <!-- Error State -->
            <div
                class="border border-red-900/50 bg-red-950/20 rounded-lg p-8 text-center"
            >
                <p class="text-red-400 mb-2">Failed to load docpacks</p>
                <p class="text-sm text-neutral-500">{data.error}</p>
            </div>
        {:else if data.docpacks.length === 0}
            <!-- Empty State -->
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
                    Be the first to publish a docpack to the Commons!
                </p>
            </div>
        {:else}
            <!-- Docpacks Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {#each data.docpacks as docpack}
                    <div
                        class="border border-neutral-800 rounded-lg p-6 hover:border-neutral-700 transition-colors"
                    >
                        <!-- Header -->
                        <div class="mb-4">
                            <h3 class="text-xl font-normal text-white mb-1">
                                {docpack.name}
                            </h3>
                            <div class="flex items-center gap-2 text-sm">
                                <span class="text-neutral-500"
                                    >v{docpack.version}</span
                                >
                                <span class="text-neutral-700">•</span>
                                <span class="text-neutral-600"
                                    >{docpack.ecosystem}</span
                                >
                            </div>
                        </div>

                        <!-- Summary -->
                        {#if docpack.summary}
                            <p
                                class="text-sm text-neutral-400 mb-4 line-clamp-2"
                            >
                                {docpack.summary}
                            </p>
                        {:else if docpack.description}
                            <p
                                class="text-sm text-neutral-400 mb-4 line-clamp-2"
                            >
                                {docpack.description}
                            </p>
                        {/if}

                        <!-- Tags -->
                        {#if docpack.tags && docpack.tags.length > 0}
                            <div class="flex flex-wrap gap-2 mb-4">
                                {#each docpack.tags.slice(0, 3) as tag}
                                    <span
                                        class="px-2 py-1 text-xs bg-neutral-900 text-neutral-400 rounded"
                                    >
                                        {tag}
                                    </span>
                                {/each}
                                {#if docpack.tags.length > 3}
                                    <span
                                        class="text-xs text-neutral-600 self-center"
                                    >
                                        +{docpack.tags.length - 3} more
                                    </span>
                                {/if}
                            </div>
                        {/if}

                        <!-- Footer -->
                        <div
                            class="flex items-center justify-between pt-4 border-t border-neutral-800"
                        >
                            <div
                                class="flex items-center gap-4 text-xs text-neutral-600"
                            >
                                <div class="flex items-center gap-1">
                                    <svg
                                        class="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                        />
                                    </svg>
                                    <span
                                        >{formatDownloads(
                                            docpack.downloads,
                                        )}</span
                                    >
                                </div>
                                <span>{formatDate(docpack.published_at)}</span>
                            </div>
                            {#if docpack.homepage}
                                <a
                                    href={docpack.homepage}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
                                >
                                    View →
                                </a>
                            {/if}
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</main>
