<script lang="ts">
    import type { Repository } from "$lib/types";

    interface Props {
        repositories: Repository[];
        loading?: boolean;
        onSelect: (repo: Repository) => void;
        onClose: () => void;
    }

    let { repositories, loading = false, onSelect, onClose }: Props = $props();

    let searchQuery = $state("");

    let filteredRepos = $derived(
        repositories.filter(
            (repo) =>
                repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                repo.description
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase()),
        ),
    );

    function handleSelect(repo: Repository) {
        if (!repo.has_docpack) {
            onSelect(repo);
        }
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "Escape") {
            onClose();
        }
    }
</script>

<svelte:window onkeydown={handleKeydown} />

<div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    onclick={onClose}
    role="presentation"
>
    <div
        class="bg-neutral-900 rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col border border-neutral-800"
        onclick={(e) => e.stopPropagation()}
        role="presentation"
    >
        <div class="p-6 border-b border-neutral-800">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-2xl font-normal text-white">
                    Select a Repository
                </h2>
                <button
                    onclick={onClose}
                    class="text-neutral-400 hover:text-white transition-colors"
                    aria-label="Close"
                >
                    <svg
                        class="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>
            <input
                type="text"
                bind:value={searchQuery}
                placeholder="Search repositories..."
                class="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600"
            />
        </div>

        <div class="flex-1 overflow-y-auto p-6">
            {#if loading}
                <div class="flex justify-center items-center py-12">
                    <div
                        class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"
                    ></div>
                </div>
            {:else if filteredRepos.length === 0}
                <div class="text-center py-12">
                    <p class="text-neutral-500">
                        {searchQuery
                            ? "No repositories found matching your search"
                            : "No repositories found"}
                    </p>
                </div>
            {:else}
                <div class="space-y-3">
                    {#each filteredRepos as repo (repo.id)}
                        <button
                            onclick={() => handleSelect(repo)}
                            disabled={repo.has_docpack}
                            class="w-full text-left p-4 rounded border transition-all {repo.has_docpack
                                ? 'bg-neutral-800 border-neutral-700 cursor-not-allowed opacity-50'
                                : 'bg-neutral-800 border-neutral-700 hover:border-neutral-600 hover:bg-neutral-750'}"
                        >
                            <div class="flex items-start justify-between">
                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center gap-2 mb-1">
                                        <h3
                                            class="text-white font-medium truncate"
                                        >
                                            {repo.name}
                                        </h3>
                                        {#if repo.private}
                                            <span
                                                class="px-2 py-0.5 text-xs bg-neutral-700 text-neutral-300 rounded"
                                            >
                                                Private
                                            </span>
                                        {/if}
                                        {#if repo.has_docpack}
                                            <span
                                                class="px-2 py-0.5 text-xs bg-green-900 text-green-300 rounded"
                                            >
                                                Connected
                                            </span>
                                        {/if}
                                    </div>
                                    {#if repo.description}
                                        <p
                                            class="text-sm text-neutral-400 line-clamp-2"
                                        >
                                            {repo.description}
                                        </p>
                                    {/if}
                                    <div
                                        class="flex items-center gap-4 mt-2 text-xs text-neutral-500"
                                    >
                                        {#if repo.language}
                                            <span
                                                class="flex items-center gap-1"
                                            >
                                                <span
                                                    class="w-2 h-2 rounded-full bg-neutral-500"
                                                ></span>
                                                {repo.language}
                                            </span>
                                        {/if}
                                        <span>⭐ {repo.stargazers_count}</span>
                                        <span>
                                            Updated {new Date(
                                                repo.updated_at,
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                {#if !repo.has_docpack}
                                    <svg
                                        class="w-5 h-5 text-neutral-400 flex-shrink-0 ml-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                {/if}
                            </div>
                        </button>
                    {/each}
                </div>
            {/if}
        </div>
    </div>
</div>

<style>
    .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
</style>
