<script lang="ts">
    import type { SessionUser } from "$lib/types";

    interface Props {
        user?: SessionUser | null;
    }

    let { user = null }: Props = $props();
    let dropdownOpen = $state(false);

    function toggleDropdown() {
        dropdownOpen = !dropdownOpen;
    }

    function closeDropdown() {
        dropdownOpen = false;
    }

    function handleWindowClick() {
        closeDropdown();
    }

    function handleWindowKeydown(e: KeyboardEvent) {
        if (e.key === "Escape") {
            closeDropdown();
        }
    }
</script>

<svelte:window onclick={handleWindowClick} onkeydown={handleWindowKeydown} />

<header
    class="sticky top-0 z-50 border-b border-neutral-900 bg-black/95 backdrop-blur-sm"
>
    <div
        class="max-w-[1200px] mx-auto px-5 md:px-8 h-16 flex items-center justify-between"
    >
        <!-- Logo / Brand -->
        <div class="flex items-center gap-3 md:gap-8">
            <a
                href="/"
                class="text-lg font-normal text-white hover:text-neutral-300 transition-colors no-underline"
            >
                doctown
            </a>

            <!-- Vertical Separator -->
            <div class="h-6 w-px bg-neutral-700"></div>

            <!-- Commons Link -->
            <a
                href="/commons"
                class="text-sm font-normal text-neutral-300 hover:text-white transition-colors no-underline"
            >
                Commons
            </a>
        </div>

        <!-- Right Side: Auth Section -->
        <div class="flex items-center gap-4">
            {#if user}
                <!-- User Dropdown -->
                <div class="relative">
                    <button
                        onclick={(e) => {
                            e.stopPropagation();
                            toggleDropdown();
                        }}
                        class="flex items-center gap-2 px-3 py-1.5 rounded border border-neutral-700 hover:border-neutral-600 transition-colors bg-neutral-900/50"
                    >
                        <img
                            src={user.avatar_url}
                            alt={user.username}
                            class="w-6 h-6 rounded-full"
                        />
                        <span class="text-sm text-neutral-300"
                            >{user.username}</span
                        >
                        <svg
                            class="w-4 h-4 text-neutral-500 transition-transform {dropdownOpen
                                ? 'rotate-180'
                                : ''}"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>

                    {#if dropdownOpen}
                        <div
                            class="absolute right-0 mt-2 w-48 py-2 bg-neutral-900 border border-neutral-700 rounded shadow-lg"
                            onclick={(e) => e.stopPropagation()}
                            onkeydown={(e) => e.stopPropagation()}
                            tabindex="-1"
                            role="menu"
                        >
                            <a
                                href="https://github.com/{user.username}"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="block px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 transition-colors no-underline"
                            >
                                GitHub Profile
                            </a>
                            <a
                                href="/dashboard"
                                class="block px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 transition-colors no-underline"
                            >
                                My Docpacks
                            </a>
                            <a
                                href="/settings"
                                class="block px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 transition-colors no-underline"
                            >
                                Account Settings
                            </a>
                            <hr class="my-2 border-neutral-800" />
                            <a
                                href="/auth/logout"
                                class="block px-4 py-2 text-sm text-red-400 hover:bg-neutral-800 transition-colors no-underline"
                            >
                                Logout
                            </a>
                        </div>
                    {/if}
                </div>
            {:else}
                <!-- Login Button -->
                <a
                    href="/auth/login"
                    class="px-4 py-2 text-sm bg-white text-black rounded hover:bg-neutral-200 transition-colors no-underline font-normal"
                >
                    Login with GitHub
                </a>
            {/if}
        </div>
    </div>
</header>
