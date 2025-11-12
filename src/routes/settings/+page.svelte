<script lang="ts">
    import type { SessionUser } from "$lib/types";
    import { invalidateAll } from "$app/navigation";
    import { PUBLIC_BACKEND_URL } from "$env/static/public";

    interface PageData {
        user?: SessionUser | null;
    }

    let { data }: { data: PageData } = $props();

    let emailNotifications = $state(data.user?.email_notifications ?? true);
    let saving = $state(false);
    let saveMessage = $state<{ type: "success" | "error"; text: string } | null>(null);

    async function handleSaveSettings() {
        if (!data.user) return;

        saving = true;
        saveMessage = null;

        try {
            const sessionToken = document.cookie
                .split("; ")
                .find((row) => row.startsWith("session_token="))
                ?.split("=")[1];

            if (!sessionToken) {
                throw new Error("No session token found");
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
                    }),
                },
            );

            if (!response.ok) {
                throw new Error("Failed to save settings");
            }

            // Refresh user data
            await invalidateAll();

            saveMessage = {
                type: "success",
                text: "Settings saved successfully",
            };

            // Clear success message after 3 seconds
            setTimeout(() => {
                saveMessage = null;
            }, 3000);
        } catch (error) {
            console.error("Error saving settings:", error);
            saveMessage = {
                type: "error",
                text: "Failed to save settings. Please try again.",
            };
        } finally {
            saving = false;
        }
    }
</script>

<main class="min-h-screen bg-black">
    <div class="max-w-[800px] mx-auto px-5 md:px-8 py-16">
        {#if data.user}
            <!-- Header -->
            <div class="mb-8">
                <h1 class="text-4xl font-normal mb-2 text-white">
                    Account Settings
                </h1>
                <p class="text-lg text-neutral-400">
                    Manage your account preferences
                </p>
            </div>

            <!-- Settings Form -->
            <div class="border border-neutral-800 rounded-lg overflow-hidden">
                <!-- Profile Section -->
                <div class="p-6 border-b border-neutral-800">
                    <h2 class="text-xl font-normal mb-4 text-white">Profile</h2>
                    <div class="flex items-center gap-4">
                        <img
                            src={data.user.avatar_url}
                            alt={data.user.username}
                            class="w-16 h-16 rounded-full"
                        />
                        <div>
                            <div class="text-white font-medium">
                                {data.user.username}
                            </div>
                            <a
                                href="https://github.com/{data.user.username}"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="text-sm text-neutral-400 hover:text-neutral-300 transition-colors"
                            >
                                View GitHub Profile →
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Email Notifications Section -->
                <div class="p-6 border-b border-neutral-800">
                    <h2 class="text-xl font-normal mb-4 text-white">
                        Email Preferences
                    </h2>
                    <label class="flex items-start gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            bind:checked={emailNotifications}
                            class="w-4 h-4 mt-0.5 rounded border-neutral-600 bg-neutral-900 text-white focus:ring-2 focus:ring-white focus:ring-offset-0 focus:ring-offset-black cursor-pointer"
                        />
                        <div class="flex-1">
                            <div
                                class="text-neutral-200 group-hover:text-white transition-colors"
                            >
                                Email me about major updates and launch
                            </div>
                            <div class="text-sm text-neutral-500 mt-1">
                                No spam. Only launch announcements and breaking
                                features.
                            </div>
                        </div>
                    </label>
                </div>

                <!-- Account Info Section -->
                <div class="p-6">
                    <h2 class="text-xl font-normal mb-4 text-white">
                        Account Information
                    </h2>
                    <div class="space-y-3 text-sm">
                        <div class="flex justify-between">
                            <span class="text-neutral-400">GitHub ID</span>
                            <span class="text-neutral-200"
                                >{data.user.github_id}</span
                            >
                        </div>
                        <div class="flex justify-between">
                            <span class="text-neutral-400">Account Type</span>
                            <span class="text-neutral-200">Free</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Save Button & Message -->
            <div class="mt-6 flex items-center gap-4">
                <button
                    onclick={handleSaveSettings}
                    disabled={saving}
                    class="px-6 py-3 bg-white text-black rounded hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-normal"
                >
                    {saving ? "Saving..." : "Save Settings"}
                </button>

                {#if saveMessage}
                    <div
                        class="text-sm {saveMessage.type === 'success'
                            ? 'text-green-400'
                            : 'text-red-400'}"
                    >
                        {saveMessage.text}
                    </div>
                {/if}
            </div>
        {:else}
            <!-- Not Logged In State -->
            <div class="text-center py-20">
                <h1 class="text-3xl font-normal mb-4 text-white">
                    Please log in
                </h1>
                <p class="text-neutral-500 mb-8">
                    You need to be logged in to access account settings.
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
