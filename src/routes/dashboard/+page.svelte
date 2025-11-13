<script lang="ts">
    import type {
        SessionUser,
        Repository,
        Docpack,
        GenerationJob,
    } from "$lib/types";
    import OnboardingModal from "$lib/components/OnboardingModal.svelte";
    import RepositorySelector from "$lib/components/RepositorySelector.svelte";
    import GenerationProgress from "$lib/components/GenerationProgress.svelte";
    import { invalidateAll } from "$app/navigation";
    import { PUBLIC_BACKEND_URL } from "$env/static/public";
    import { onDestroy } from "svelte";

    interface PageData {
        user?: SessionUser | null;
    }

    let { data }: { data: PageData } = $props();

    let showOnboarding = $state(false);
    let showRepoSelector = $state(false);
    let repositories = $state<Repository[]>([]);
    let docpacks = $state<Docpack[]>([]);
    let jobs = $state<Map<number, GenerationJob>>(new Map()); // docpack_id -> job
    let loadingRepos = $state(false);
    let loadingDocpacks = $state(false);
    let creatingDocpack = $state(false);
    let generatingDocs = $state<Set<number>>(new Set());
    let error = $state<string | null>(null);
    let pollInterval: ReturnType<typeof setInterval> | null = null;

    $effect(() => {
        // Show modal on every login unless dismissed in this session
        console.log("Dashboard effect running, user:", data.user);
        if (data.user) {
            const dismissed = sessionStorage.getItem("onboarding_dismissed");
            console.log("Session dismissed flag:", dismissed);
            console.log("User data:", data.user);
            if (!dismissed) {
                console.log("Setting showOnboarding to true");
                showOnboarding = true;
            }
            // Load user's docpacks
            loadDocpacks();

            // Start polling for active jobs
            startPolling();
        }
    });

    onDestroy(() => {
        if (pollInterval) {
            clearInterval(pollInterval);
        }
    });

    function startPolling() {
        if (pollInterval) return;

        pollInterval = setInterval(() => {
            // Poll for any active jobs
            const activeDocpacks = Array.from(jobs.entries())
                .filter(
                    ([_, job]) =>
                        job.status === "pending" || job.status === "running",
                )
                .map(([docpackId, _]) => docpackId);

            if (activeDocpacks.length > 0) {
                activeDocpacks.forEach((docpackId) => pollJobStatus(docpackId));
            }
        }, 1000); // Poll every 1 second for near real-time updates
    }

    async function loadDocpacks() {
        loadingDocpacks = true;
        error = null;

        try {
            const response = await fetch("/api/docpacks", {
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to load docpacks");
            }

            const newDocpacks = await response.json();
            docpacks = newDocpacks;

            // Load job status for each docpack, but keep existing job data
            for (const docpack of docpacks) {
                // Only check for jobs if we don't already have current job data or if docpack is not public yet
                if (!docpack.is_public && !jobs.has(docpack.id)) {
                    await loadJobStatus(docpack.id);
                }
            }

            // Clean up jobs for docpacks that are now public (completed)
            const docpackIds = new Set(docpacks.map((d) => d.id));
            for (const [jobDocpackId, job] of jobs.entries()) {
                // If docpack is now public and job is completed, we can keep the job to show completion message
                const docpack = docpacks.find((d) => d.id === jobDocpackId);
                if (docpack?.is_public && job.status === "completed") {
                    // Keep completed jobs visible for a bit
                    setTimeout(() => {
                        jobs.delete(jobDocpackId);
                        jobs = jobs; // trigger reactivity
                    }, 5000);
                }
            }
        } catch (err) {
            console.error("Error loading docpacks:", err);
            error = "Failed to load your docpacks";
        } finally {
            loadingDocpacks = false;
        }
    }

    async function loadJobStatus(docpackId: number) {
        try {
            const response = await fetch(`/api/docpacks/${docpackId}/job`, {
                credentials: "include",
            });

            if (response.ok) {
                const job: GenerationJob = await response.json();
                jobs.set(docpackId, job);
            }
        } catch (err) {
            // No job found, that's okay
            console.debug(`No job found for docpack ${docpackId}`);
        }
    }

    async function pollJobStatus(docpackId: number) {
        try {
            const response = await fetch(`/api/docpacks/${docpackId}/job`, {
                credentials: "include",
            });

            if (response.ok) {
                const job: GenerationJob = await response.json();
                const previousStatus = jobs.get(docpackId)?.status;
                jobs.set(docpackId, job);

                // If job just completed, reload docpacks to get updated status
                if (
                    (job.status === "completed" || job.status === "failed") &&
                    previousStatus !== job.status
                ) {
                    await loadDocpacks();
                }
            }
        } catch (err) {
            console.error(`Error polling job for docpack ${docpackId}:`, err);
        }
    }

    async function generateDocumentation(docpackId: number) {
        generatingDocs.add(docpackId);
        error = null;

        try {
            const response = await fetch("/api/jobs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ docpack_id: docpackId }),
            });

            if (!response.ok) {
                if (response.status === 409) {
                    throw new Error(
                        "A generation job is already running for this docpack",
                    );
                }
                throw new Error("Failed to start documentation generation");
            }

            const job: GenerationJob = await response.json();
            jobs.set(docpackId, job);
        } catch (err) {
            console.error("Error starting generation:", err);
            error =
                err instanceof Error
                    ? err.message
                    : "Failed to start documentation generation";
        } finally {
            generatingDocs.delete(docpackId);
        }
    }

    async function loadRepositories() {
        loadingRepos = true;
        error = null;

        try {
            const response = await fetch("/api/repositories", {
                credentials: "include",
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(
                    "Repository fetch failed:",
                    response.status,
                    errorText,
                );
                throw new Error(
                    `Failed to load repositories: ${response.status} ${errorText}`,
                );
            }

            repositories = await response.json();
            showRepoSelector = true;
        } catch (err) {
            console.error("Error loading repositories:", err);
            error =
                err instanceof Error
                    ? err.message
                    : "Failed to load your repositories from GitHub";
        } finally {
            loadingRepos = false;
        }
    }

    async function handleRepositorySelect(repo: Repository) {
        creatingDocpack = true;
        error = null;

        try {
            const response = await fetch("/api/docpacks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    name: repo.name,
                    github_repo_id: repo.id,
                    github_repo_full_name: repo.full_name,
                    github_repo_url: repo.html_url,
                    default_branch: repo.default_branch,
                }),
            });

            if (!response.ok) {
                if (response.status === 409) {
                    throw new Error(
                        "You already have a docpack for this repository",
                    );
                }
                throw new Error("Failed to create docpack");
            }

            const newDocpack = await response.json();
            docpacks = [newDocpack, ...docpacks];
            showRepoSelector = false;
        } catch (err) {
            console.error("Error creating docpack:", err);
            error =
                err instanceof Error ? err.message : "Failed to create docpack";
        } finally {
            creatingDocpack = false;
        }
    }

    function handleAddDocpack() {
        loadRepositories();
    }

    async function handleSavePreferences(emailNotifications: boolean) {
        try {
            const response = await fetch("/api/users/preferences", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    email_notifications: emailNotifications,
                    onboarding_completed: true,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to save preferences");
            }

            // Refresh user data
            await invalidateAll();

            // Mark as dismissed for this session
            sessionStorage.setItem("onboarding_dismissed", "true");
            showOnboarding = false;
        } catch (error) {
            console.error("Error saving preferences:", error);
        }
    }

    function handleCloseModal() {
        // Mark as dismissed for this session
        sessionStorage.setItem("onboarding_dismissed", "true");
        showOnboarding = false;
    }
</script>

{#if showOnboarding && data.user}
    <OnboardingModal
        username={data.user.username}
        initialEmailNotifications={data.user.email_notifications}
        onClose={handleCloseModal}
        onSavePreferences={handleSavePreferences}
    />
{/if}

{#if showRepoSelector}
    <RepositorySelector
        {repositories}
        loading={creatingDocpack}
        onSelect={handleRepositorySelect}
        onClose={() => (showRepoSelector = false)}
    />
{/if}

<main class="min-h-screen bg-black">
    <div class="max-w-[1200px] mx-auto px-5 md:px-8 py-16">
        {#if data.user}
            <div class="mb-8">
                <div class="flex items-center justify-between mb-4">
                    <h1 class="text-4xl font-normal text-white">My Docpacks</h1>
                    <button
                        onclick={handleAddDocpack}
                        disabled={loadingRepos}
                        class="px-6 py-3 bg-white text-black rounded hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loadingRepos ? "Loading..." : "+ Add New Docpack"}
                    </button>
                </div>
                <p class="text-lg text-neutral-400">
                    Welcome back, <span class="text-white"
                        >{data.user.username}</span
                    >
                </p>
            </div>

            {#if error}
                <div
                    class="mb-6 p-4 bg-red-900 border border-red-700 rounded text-red-200"
                >
                    {error}
                </div>
            {/if}

            {#if loadingDocpacks}
                <div class="flex justify-center items-center py-20">
                    <div
                        class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"
                    ></div>
                </div>
            {:else if docpacks.length === 0}
                <div
                    class="border border-neutral-800 rounded-lg p-12 text-center"
                >
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
                        Connect a GitHub repository to get started.<br />
                        AI-powered documentation generation coming soon!
                    </p>
                </div>
            {:else}
                <div class="grid gap-6 md:grid-cols-1">
                    {#each docpacks as docpack (docpack.id)}
                        <div class="border border-neutral-800 rounded-lg p-6">
                            <div class="flex items-start justify-between mb-4">
                                <a
                                    href="/docpacks/{docpack.id}"
                                    class="flex-1 no-underline"
                                >
                                    <h3
                                        class="text-xl font-medium text-white mb-2"
                                    >
                                        {docpack.name}
                                    </h3>
                                    {#if docpack.github_repo_full_name}
                                        <span
                                            class="text-sm text-neutral-400 flex items-center gap-1"
                                        >
                                            <svg
                                                class="w-4 h-4"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    fill-rule="evenodd"
                                                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                                    clip-rule="evenodd"
                                                />
                                            </svg>
                                            {docpack.github_repo_full_name}
                                        </span>
                                    {/if}
                                </a>

                                {#if !docpack.is_public && !jobs.has(docpack.id)}
                                    <button
                                        onclick={() =>
                                            generateDocumentation(docpack.id)}
                                        disabled={generatingDocs.has(
                                            docpack.id,
                                        )}
                                        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                                    >
                                        {generatingDocs.has(docpack.id)
                                            ? "Starting..."
                                            : "Generate Docs"}
                                    </button>
                                {/if}
                            </div>

                            {#if docpack.summary}
                                <p class="text-sm text-neutral-400 mb-4">
                                    {docpack.summary}
                                </p>
                            {/if}

                            <div
                                class="flex items-center gap-4 text-xs text-neutral-500 mb-4"
                            >
                                <span class="px-2 py-1 bg-neutral-800 rounded">
                                    {docpack.ecosystem}
                                </span>
                                <span>v{docpack.version}</span>
                                {#if docpack.is_public}
                                    <span
                                        class="px-2 py-1 bg-green-900 text-green-300 rounded"
                                    >
                                        Public
                                    </span>
                                {:else}
                                    <span
                                        class="px-2 py-1 bg-yellow-900 text-yellow-300 rounded"
                                    >
                                        Pending
                                    </span>
                                {/if}
                            </div>

                            <!-- Show generation progress if job exists -->
                            {#if jobs.has(docpack.id)}
                                <GenerationProgress
                                    job={jobs.get(docpack.id)!}
                                />
                            {/if}
                        </div>
                    {/each}
                </div>
            {/if}
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
