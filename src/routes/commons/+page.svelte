<script lang="ts">
    import type { SessionUser } from "$lib/types";

    interface PageData {
        user?: SessionUser | null;
    }

    let { data }: { data: PageData } = $props();
</script>

<main class="min-h-screen bg-black">
    <div class="max-w-[1200px] mx-auto px-5 md:px-8 py-16">
        <div class="mb-8">
            <h1 class="text-4xl font-normal mb-4 text-white">
                Commons
            </h1>
            <p class="text-lg text-neutral-400">
                Explore public docpacks from the community
            </p>
        </div>

        <!-- Coming Soon Placeholder -->
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
                        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            </div>
            <h2 class="text-2xl font-normal mb-3 text-white">
                Coming Soon
            </h2>
            <p class="text-neutral-500 mb-6">
                The Commons is where you'll discover and explore public docpacks from the community.<br />
                We're still building the storage infrastructure for this feature.
            </p>
            <div class="max-w-2xl mx-auto text-left">
                <h3 class="text-lg font-normal mb-4 text-white">What to expect:</h3>
                <ul class="space-y-2 text-neutral-400">
                    <li class="flex items-start gap-2">
                        <span class="text-green-500 mt-1">→</span>
                        <span>Browse all public docpacks in one place</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <span class="text-green-500 mt-1">→</span>
                        <span>Search and filter by topic, language, or framework</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <span class="text-green-500 mt-1">→</span>
                        <span>View documentation directly in your browser</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <span class="text-green-500 mt-1">→</span>
                        <span>All docpacks are public by default</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</main>
