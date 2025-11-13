<script lang="ts">
    import type { GenerationJob } from "$lib/types";

    interface Props {
        job: GenerationJob;
        onClose?: () => void;
    }

    let { job, onClose }: Props = $props();

    function getStageLabel(stage: string | null): string {
        if (!stage) return "Initializing";
        const stages: Record<string, string> = {
            cloning: "Cloning Repository",
            analyzing: "Analyzing Code",
            generating: "Generating Documentation",
            packing: "Creating Docpack",
            uploading: "Uploading to Storage",
        };
        return stages[stage] || stage;
    }

    function getStatusColor(status: string): string {
        const colors: Record<string, string> = {
            pending: "text-yellow-400",
            running: "text-blue-400",
            completed: "text-green-400",
            failed: "text-red-400",
            cancelled: "text-neutral-400",
        };
        return colors[status] || "text-neutral-400";
    }

    function formatTimestamp(timestamp: string): string {
        const date = new Date(timestamp);
        return date.toLocaleTimeString();
    }
</script>

<div class="border border-neutral-800 rounded-lg p-6 bg-neutral-900">
    <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-medium text-white">
            Documentation Generation
        </h3>
        {#if onClose}
            <button
                onclick={onClose}
                class="text-neutral-500 hover:text-white transition-colors"
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
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </button>
        {/if}
    </div>

    <!-- Status Badge -->
    <div class="mb-4">
        <span
            class="inline-flex items-center gap-2 px-3 py-1 rounded {getStatusColor(
                job.status,
            )} bg-opacity-10 border border-current"
        >
            {#if job.status === "running"}
                <div
                    class="animate-spin rounded-full h-3 w-3 border-b-2 border-current"
                ></div>
            {/if}
            <span class="font-medium capitalize">{job.status}</span>
        </span>
    </div>

    <!-- Progress Bar -->
    {#if job.status === "running" || job.status === "pending"}
        <div class="mb-4">
            <div class="flex justify-between text-sm mb-2">
                <span class="text-neutral-400">{getStageLabel(job.stage)}</span>
                <span class="text-white">{job.progress_pct}%</span>
            </div>
            <div class="w-full bg-neutral-800 rounded-full h-2">
                <div
                    class="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style="width: {job.progress_pct}%"
                ></div>
            </div>
        </div>
    {/if}

    <!-- Error Message -->
    {#if job.status === "failed" && job.error_message}
        <div class="mb-4 p-3 bg-red-900 bg-opacity-20 border border-red-700 rounded">
            <p class="text-sm text-red-300">{job.error_message}</p>
        </div>
    {/if}

    <!-- Success Message -->
    {#if job.status === "completed"}
        <div
            class="mb-4 p-3 bg-green-900 bg-opacity-20 border border-green-700 rounded"
        >
            <p class="text-sm text-green-300">
                Documentation generated successfully! The docpack is now public.
            </p>
        </div>
    {/if}

    <!-- Logs -->
    {#if job.log_messages && job.log_messages.length > 0}
        <div class="mt-4">
            <button
                onclick={() => {
                    const logsEl = document.getElementById("logs-" + job.id);
                    if (logsEl) {
                        logsEl.classList.toggle("hidden");
                    }
                }}
                class="text-sm text-neutral-400 hover:text-white transition-colors mb-2"
            >
                Toggle Logs ({job.log_messages.length})
            </button>
            <div
                id="logs-{job.id}"
                class="hidden max-h-60 overflow-y-auto bg-black border border-neutral-800 rounded p-3 font-mono text-xs"
            >
                {#each job.log_messages.slice(-20) as log}
                    <div class="mb-1">
                        <span class="text-neutral-600"
                            >[{formatTimestamp(log.timestamp)}]</span
                        >
                        <span
                            class="text-{log.level === 'error'
                                ? 'red'
                                : log.level === 'warning'
                                  ? 'yellow'
                                  : 'neutral'}-400"
                        >
                            [{log.level.toUpperCase()}]
                        </span>
                        <span class="text-neutral-300">{log.message}</span>
                    </div>
                {/each}
            </div>
        </div>
    {/if}

    <!-- Timestamps -->
    <div class="mt-4 pt-4 border-t border-neutral-800 text-xs text-neutral-500">
        <div class="flex gap-4">
            <span>Created: {new Date(job.created_at).toLocaleString()}</span>
            {#if job.started_at}
                <span>Started: {new Date(job.started_at).toLocaleString()}</span>
            {/if}
            {#if job.completed_at}
                <span
                    >Completed: {new Date(job.completed_at).toLocaleString()}</span
                >
            {/if}
        </div>
    </div>
</div>
