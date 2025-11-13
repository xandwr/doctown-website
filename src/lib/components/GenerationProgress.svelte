<script lang="ts">
    import type { GenerationJob } from "$lib/types";
    import { onMount } from "svelte";

    interface Props {
        job: GenerationJob;
        onClose?: () => void;
    }

    let { job, onClose }: Props = $props();
    let logsContainer: HTMLDivElement | null = null;
    let previousLogCount = 0;

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

    // Auto-scroll logs when new messages arrive
    $effect(() => {
        if (job.log_messages && job.log_messages.length > previousLogCount) {
            previousLogCount = job.log_messages.length;
            if (
                logsContainer &&
                (job.status === "running" || job.status === "pending")
            ) {
                // Small delay to ensure DOM is updated
                setTimeout(() => {
                    logsContainer?.scrollTo({
                        top: logsContainer.scrollHeight,
                        behavior: "smooth",
                    });
                }, 100);
            }
        }
    });
</script>

<div class="border border-neutral-800 rounded-lg p-6 bg-neutral-900">
    <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-medium text-white">Documentation Generation</h3>
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

    <!-- Stage Indicator -->
    {#if job.status === "running" || job.status === "pending"}
        <div class="mb-4">
            <div class="flex items-center gap-2 text-sm">
                <div
                    class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"
                ></div>
                <span class="text-blue-400 font-medium"
                    >{getStageLabel(job.stage)}</span
                >
            </div>
        </div>
    {/if}

    <!-- Error Message -->
    {#if job.status === "failed" && job.error_message}
        <div
            class="mb-4 p-3 bg-red-900 bg-opacity-20 border border-red-700 rounded"
        >
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

    <!-- Logs (always visible during generation) -->
    {#if job.log_messages && job.log_messages.length > 0}
        <div class="mt-4">
            <div class="flex items-center justify-between mb-2">
                <h4 class="text-sm font-medium text-neutral-400">
                    Process Log ({job.log_messages.length} messages)
                </h4>
                {#if job.status === "running" || job.status === "pending"}
                    <span class="text-xs text-neutral-500">Live updates</span>
                {/if}
            </div>
            <div
                bind:this={logsContainer}
                id="logs-{job.id}"
                class="max-h-80 overflow-y-auto bg-black border border-neutral-800 rounded p-3 font-mono text-xs scroll-smooth"
            >
                {#each job.log_messages as log}
                    <div class="mb-1 leading-relaxed">
                        <span class="text-neutral-600"
                            >[{formatTimestamp(log.timestamp)}]</span
                        >
                        <span
                            class="text-{log.level === 'error'
                                ? 'red'
                                : log.level === 'warning'
                                  ? 'yellow'
                                  : log.level === 'debug'
                                    ? 'neutral-600'
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
                <span>Started: {new Date(job.started_at).toLocaleString()}</span
                >
            {/if}
            {#if job.completed_at}
                <span
                    >Completed: {new Date(
                        job.completed_at,
                    ).toLocaleString()}</span
                >
            {/if}
        </div>
    </div>
</div>
