<script lang="ts">
    import type { SessionUser, Repository, Docpack } from "$lib/types";
    import OnboardingModal from "$lib/components/OnboardingModal.svelte";
    import RepositorySelector from "$lib/components/RepositorySelector.svelte";
    import { invalidateAll } from "$app/navigation";
    import { PUBLIC_BACKEND_URL } from "$env/static/public";

    interface PageData {
        user?: SessionUser | null;
    }

    let { data }: { data: PageData } = $props();

    let showOnboarding = $state(false);
    let showRepoSelector = $state(false);
    let repositories = $state<Repository[]>([]);
    let docpacks = $state<Docpack[]>([]);
    let loadingRepos = $state(false);
    let loadingDocpacks = $state(false);
    let creatingDocpack = $state(false);
    let error = $state<string | null>(null);

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
        }
    });

    function getSessionToken(): string | null {
        return (
            document.cookie
                .split("; ")
                .find((row) => row.startsWith("session_token="))
                ?.split("=")[1] || null
        );
    }

    async function loadDocpacks() {
        const sessionToken = getSessionToken();
        if (!sessionToken) return;

        loadingDocpacks = true;
        error = null;

        try {
            const response = await fetch(
                `${PUBLIC_BACKEND_URL}/api/v1/docpacks/me`,
                {
                    headers: {
                        Authorization: `Bearer ${sessionToken}`,
                    },
                    credentials: "include",
                },
            );

            if (!response.ok) {
                throw new Error("Failed to load docpacks");
            }

            docpacks = await response.json();
        } catch (err) {
            console.error("Error loading docpacks:", err);
            error = "Failed to load your docpacks";
        } finally {
            loadingDocpacks = false;
        }
    }

    async function loadRepositories() {
        const sessionToken = getSessionToken();
        if (!sessionToken) return;

        loadingRepos = true;
        error = null;

        try {
            const response = await fetch(
                `${PUBLIC_BACKEND_URL}/api/v1/repositories`,
                {
                    headers: {
                        Authorization: `Bearer ${sessionToken}`,
                    },
                    credentials: "include",
                },
            );

            if (!response.ok) {
                throw new Error("Failed to load repositories");
            }

            repositories = await response.json();
            showRepoSelector = true;
        } catch (err) {
            console.error("Error loading repositories:", err);
            error = "Failed to load your repositories from GitHub";
        } finally {
            loadingRepos = false;
        }
    }

    async function handleRepositorySelect(repo: Repository) {
        const sessionToken = getSessionToken();
        if (!sessionToken) return;

        creatingDocpack = true;
        error = null;

        try {
            const response = await fetch(
                `${PUBLIC_BACKEND_URL}/api/v1/docpacks`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionToken}`,
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        name: repo.name,
                        github_repo_id: repo.id,
                        github_repo_full_name: repo.full_name,
                        github_repo_url: repo.html_url,
                        default_branch: repo.default_branch,
                    }),
                },
            );

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
            const sessionToken = document.cookie
                .split("; ")
                .find((row) => row.startsWith("session_token="))
                ?.split("=")[1];

            if (!sessionToken) {
                console.error("No session token found");
                return;
            }

            const response = await fetch(
                `${PUBLIC_BACKEND_URL}/api/v1/users/preferences`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionToken}`,
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        email_notifications: emailNotifications,
                        onboarding_completed: true,
                    }),
                },
            );

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
                <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {#each docpacks as docpack (docpack.id)}
                        <div
                            class="border border-neutral-800 rounded-lg p-6 hover:border-neutral-700 transition-colors"
                        >
                            <div class="mb-4">
                                <h3 class="text-xl font-medium text-white mb-2">
                                    {docpack.name}
                                </h3>
                                {#if docpack.github_repo_full_name}
                                    <a
                                        href={docpack.github_repo_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="text-sm text-neutral-400 hover:text-neutral-300 flex items-center gap-1"
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
                                    </a>
                                {/if}
                            </div>
                            {#if docpack.summary}
                                <p class="text-sm text-neutral-400 mb-4">
                                    {docpack.summary}
                                </p>
                            {/if}
                            <div
                                class="flex items-center gap-4 text-xs text-neutral-500"
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
