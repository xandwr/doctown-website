<script lang="ts">
    interface Props {
        username: string;
        initialEmailNotifications?: boolean;
        onClose: () => void;
        onSavePreferences: (emailNotifications: boolean) => void;
    }

    let {
        username,
        initialEmailNotifications = true,
        onClose,
        onSavePreferences,
    }: Props = $props();
    let emailNotifications = $state(initialEmailNotifications);

    function handleContinue() {
        onSavePreferences(emailNotifications);
        onClose();
    }

    function handleBackdropKeydown(e: KeyboardEvent) {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleContinue();
        }
    }

    function handleModalKeydown(e: KeyboardEvent) {
        e.stopPropagation();
    }
</script>

<!-- Backdrop -->
<div
    class="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    onclick={handleContinue}
    onkeydown={handleBackdropKeydown}
    role="button"
    tabindex="0"
>
    <!-- Modal -->
    <div
        class="bg-neutral-950 border border-neutral-800 max-w-[600px] w-full p-8 md:p-12"
        onclick={(e) => e.stopPropagation()}
        onkeydown={handleModalKeydown}
        role="dialog"
        aria-modal="true"
        tabindex="0"
        aria-labelledby="modal-title"
    >
        <!-- Welcome -->
        <h2
            id="modal-title"
            class="text-3xl md:text-4xl font-normal mb-4 text-white"
        >
            Welcome, {username}.
        </h2>

        <p class="text-lg text-neutral-400 mb-8">
            You're early. Here's what's coming.
        </p>

        <!-- What's Coming -->
        <div class="mb-8 space-y-3">
            <div class="flex items-start gap-3">
                <span class="text-green-500 mt-1">→</span>
                <p class="text-neutral-300">
                    <strong class="text-white font-normal"
                        >AI Documentation Generation</strong
                    ><br />
                    <span class="text-sm text-neutral-500"
                        >Link your GitHub repo, get a docpack in minutes. No
                        manual writing.</span
                    >
                </p>
            </div>

            <div class="flex items-start gap-3">
                <span class="text-green-500 mt-1">→</span>
                <p class="text-neutral-300">
                    <strong class="text-white font-normal"
                        >Creator Tier ($12/mo)</strong
                    ><br />
                    <span class="text-sm text-neutral-500"
                        >Publish unlimited docpacks. Includes compute tokens for
                        AI generation.</span
                    >
                </p>
            </div>

            <div class="flex items-start gap-3">
                <span class="text-green-500 mt-1">→</span>
                <p class="text-neutral-300">
                    <strong class="text-white font-normal"
                        >Global Registry</strong
                    ><br />
                    <span class="text-sm text-neutral-500"
                        >Your docs become instantly installable by thousands of
                        developers worldwide.</span
                    >
                </p>
            </div>

            <div class="flex items-start gap-3">
                <span class="text-green-500 mt-1">→</span>
                <p class="text-neutral-300">
                    <strong class="text-white font-normal">CLI Tool</strong><br
                    />
                    <span class="text-sm text-neutral-500"
                        >Install and query any documentation from your terminal.
                        Offline, fast, local-first.</span
                    >
                </p>
            </div>
        </div>

        <!-- Email Preference -->
        <div class="mb-8 pb-8 border-b border-neutral-800">
            <label class="flex items-center gap-3 cursor-pointer group">
                <input
                    type="checkbox"
                    bind:checked={emailNotifications}
                    class="w-4 h-4 accent-white"
                />
                <span
                    class="text-neutral-300 group-hover:text-white transition-colors"
                >
                    Email me about major updates and launch
                </span>
            </label>
            <p class="text-xs text-neutral-600 mt-2 ml-7">
                No spam. Only launch announcements and breaking features.
            </p>
        </div>

        <!-- CTA -->
        <button
            onclick={handleContinue}
            class="w-full px-6 py-4 bg-white text-black font-normal hover:bg-neutral-200 transition-colors"
        >
            Let's go
        </button>

        <p class="text-xs text-neutral-600 text-center mt-4">
            You can change this preference anytime in your account settings.
        </p>
    </div>
</div>
