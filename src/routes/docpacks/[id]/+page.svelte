<script lang="ts">
    import type { Docpack } from "$lib/types";

    interface PageData {
        docpack: Docpack;
    }

    let { data }: { data: PageData } = $props();

    let saving = $state(false);
    let error = $state<string | null>(null);
    let successMessage = $state<string | null>(null);

    // Editable fields - initialize in $effect
    let editableName = $state(data.docpack.name);
    let editableVersion = $state(data.docpack.version);
    let editableEcosystem = $state(data.docpack.ecosystem);
    let editableSummary = $state(data.docpack.summary || "");
    let editableDescription = $state(data.docpack.description || "");
    let editableHomepage = $state(data.docpack.homepage || "");
    let editableIsPublic = $state(data.docpack.is_public);
    let editableTags = $state(data.docpack.tags.join(", "));

    // Update editable fields when data changes
    $effect(() => {
        editableName = data.docpack.name;
        editableVersion = data.docpack.version;
        editableEcosystem = data.docpack.ecosystem;
        editableSummary = data.docpack.summary || "";
        editableDescription = data.docpack.description || "";
        editableHomepage = data.docpack.homepage || "";
        editableIsPublic = data.docpack.is_public;
        editableTags = data.docpack.tags.join(", ");
    });

    async function handleSave() {
        saving = true;
        error = null;
        successMessage = null;

        try {
            const response = await fetch(`/api/docpacks/${data.docpack.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    name: editableName,
                    version: editableVersion,
                    ecosystem: editableEcosystem,
                    summary: editableSummary || null,
                    description: editableDescription || null,
                    homepage: editableHomepage || null,
                    is_public: editableIsPublic,
                    tags: editableTags
                        .split(",")
                        .map((t) => t.trim())
                        .filter((t) => t.length > 0),
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update docpack");
            }

            await response.json();
            successMessage = "Docpack settings saved successfully!";

            // Clear success message after 3 seconds
            setTimeout(() => {
                successMessage = null;
            }, 3000);
        } catch (err) {
            console.error("Error saving docpack:", err);
            error =
                err instanceof Error ? err.message : "Failed to save changes";
        } finally {
            saving = false;
        }
    }

    async function handleDelete() {
        if (
            !confirm(
                `Are you sure you want to delete "${data.docpack.name}"? This action cannot be undone.`,
            )
        ) {
            return;
        }

        try {
            const response = await fetch(`/api/docpacks/${data.docpack.id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to delete docpack");
            }

            // Redirect to dashboard
            window.location.href = "/dashboard";
        } catch (err) {
            console.error("Error deleting docpack:", err);
            error =
                err instanceof Error ? err.message : "Failed to delete docpack";
        }
    }
</script>

<main class="min-h-screen bg-black">
    <div class="max-w-[900px] mx-auto px-5 md:px-8 py-16">
        <div class="mb-8">
            <a
                href="/dashboard"
                class="text-neutral-400 hover:text-white transition-colors inline-flex items-center gap-2 mb-4"
            >
                <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 19l-7-7 7-7"
                    />
                </svg>
                Back to Dashboard
            </a>
            <h1 class="text-4xl font-normal text-white mb-2">
                Docpack Settings
            </h1>
            <p class="text-lg text-neutral-400">
                Manage your documentation package
            </p>
        </div>

        {#if error}
            <div
                class="mb-6 p-4 bg-red-900 border border-red-700 rounded text-red-200"
            >
                {error}
            </div>
        {/if}

        {#if successMessage}
            <div
                class="mb-6 p-4 bg-green-900 border border-green-700 rounded text-green-200"
            >
                {successMessage}
            </div>
        {/if}

        <div class="space-y-8">
            <!-- Basic Information -->
            <section
                class="border border-neutral-800 rounded-lg p-6 bg-neutral-900"
            >
                <h2 class="text-2xl font-medium text-white mb-6">
                    Basic Information
                </h2>

                <div class="space-y-4">
                    <div>
                        <label
                            for="name"
                            class="block text-sm font-medium text-neutral-300 mb-2"
                        >
                            Package Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            bind:value={editableName}
                            class="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded text-white focus:outline-none focus:border-neutral-600"
                        />
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label
                                for="version"
                                class="block text-sm font-medium text-neutral-300 mb-2"
                            >
                                Version
                            </label>
                            <input
                                id="version"
                                type="text"
                                bind:value={editableVersion}
                                class="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded text-white focus:outline-none focus:border-neutral-600"
                            />
                        </div>

                        <div>
                            <label
                                for="ecosystem"
                                class="block text-sm font-medium text-neutral-300 mb-2"
                            >
                                Ecosystem
                            </label>
                            <input
                                id="ecosystem"
                                type="text"
                                bind:value={editableEcosystem}
                                class="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded text-white focus:outline-none focus:border-neutral-600"
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            for="summary"
                            class="block text-sm font-medium text-neutral-300 mb-2"
                        >
                            Summary
                        </label>
                        <input
                            id="summary"
                            type="text"
                            bind:value={editableSummary}
                            placeholder="Brief one-line description"
                            class="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600"
                        />
                    </div>

                    <div>
                        <label
                            for="description"
                            class="block text-sm font-medium text-neutral-300 mb-2"
                        >
                            Description
                        </label>
                        <textarea
                            id="description"
                            bind:value={editableDescription}
                            placeholder="Detailed description of your documentation package"
                            rows="4"
                            class="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600"
                        ></textarea>
                    </div>

                    <div>
                        <label
                            for="homepage"
                            class="block text-sm font-medium text-neutral-300 mb-2"
                        >
                            Homepage URL
                        </label>
                        <input
                            id="homepage"
                            type="url"
                            bind:value={editableHomepage}
                            placeholder="https://example.com"
                            class="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600"
                        />
                    </div>

                    <div>
                        <label
                            for="tags"
                            class="block text-sm font-medium text-neutral-300 mb-2"
                        >
                            Tags (comma-separated)
                        </label>
                        <input
                            id="tags"
                            type="text"
                            bind:value={editableTags}
                            placeholder="javascript, api, documentation"
                            class="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600"
                        />
                    </div>
                </div>
            </section>

            <!-- GitHub Integration -->
            <section
                class="border border-neutral-800 rounded-lg p-6 bg-neutral-900"
            >
                <h2 class="text-2xl font-medium text-white mb-6">
                    GitHub Integration
                </h2>

                <div class="space-y-3 text-neutral-300">
                    {#if data.docpack.github_repo_full_name}
                        <div class="flex justify-between items-center">
                            <span class="text-neutral-400">Repository:</span>
                            <a
                                href={data.docpack.github_repo_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                class="text-white hover:text-neutral-300 flex items-center gap-2"
                            >
                                {data.docpack.github_repo_full_name}
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
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                    />
                                </svg>
                            </a>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-neutral-400">Default Branch:</span
                            >
                            <span class="text-white"
                                >{data.docpack.default_branch}</span
                            >
                        </div>
                    {:else}
                        <p class="text-neutral-500">
                            No GitHub repository connected
                        </p>
                    {/if}
                </div>
            </section>

            <!-- Visibility Settings -->
            <section
                class="border border-neutral-800 rounded-lg p-6 bg-neutral-900"
            >
                <h2 class="text-2xl font-medium text-white mb-6">
                    Visibility Settings
                </h2>

                <div class="flex items-start gap-4">
                    <input
                        id="is_public"
                        type="checkbox"
                        bind:checked={editableIsPublic}
                        class="mt-1 w-4 h-4 bg-neutral-800 border border-neutral-700 rounded focus:ring-2 focus:ring-neutral-600"
                    />
                    <div class="flex-1">
                        <label
                            for="is_public"
                            class="text-sm font-medium text-neutral-300 cursor-pointer"
                        >
                            Make this docpack publicly available
                        </label>
                        <p class="text-sm text-neutral-500 mt-1">
                            Public docpacks will appear in the Doctown Commons
                            directory and can be discovered by anyone.
                        </p>
                    </div>
                </div>
            </section>

            <!-- Metadata -->
            <section
                class="border border-neutral-800 rounded-lg p-6 bg-neutral-900"
            >
                <h2 class="text-2xl font-medium text-white mb-6">Metadata</h2>

                <div class="space-y-3 text-sm">
                    <div class="flex justify-between">
                        <span class="text-neutral-400">Downloads:</span>
                        <span class="text-white">{data.docpack.downloads}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-neutral-400">Created:</span>
                        <span class="text-white"
                            >{new Date(
                                data.docpack.created_at,
                            ).toLocaleString()}</span
                        >
                    </div>
                    <div class="flex justify-between">
                        <span class="text-neutral-400">Last Updated:</span>
                        <span class="text-white"
                            >{new Date(
                                data.docpack.updated_at,
                            ).toLocaleString()}</span
                        >
                    </div>
                    <div class="flex justify-between">
                        <span class="text-neutral-400">Docpack ID:</span>
                        <span class="text-white font-mono"
                            >{data.docpack.id}</span
                        >
                    </div>
                </div>
            </section>

            <!-- Action Buttons -->
            <div class="flex gap-4">
                <button
                    onclick={handleSave}
                    disabled={saving}
                    class="px-6 py-3 bg-white text-black rounded hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {saving ? "Saving..." : "Save Changes"}
                </button>

                <button
                    onclick={handleDelete}
                    class="px-6 py-3 bg-red-900 text-red-200 rounded hover:bg-red-800 transition-colors border border-red-700"
                >
                    Delete Docpack
                </button>
            </div>
        </div>
    </div>
</main>
