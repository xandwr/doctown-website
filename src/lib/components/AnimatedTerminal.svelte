<script lang="ts">
    type CommandType = "input" | "output" | "success" | "error";

    type Command = {
        type: CommandType;
        text: string;
        delay?: number; // ms to wait before showing this line
    };

    type TerminalSequence = {
        prompt?: string;
        commands: Command[];
    };

    let {
        sequence = $bindable(),
        autoplay = true,
        loop = true,
        className = "",
    }: {
        sequence?: TerminalSequence;
        autoplay?: boolean;
        loop?: boolean;
        className?: string;
    } = $props();

    let lines = $state<
        Array<{ type: string; text: string; showCursor: boolean }>
    >([]);
    let isRunning = $state(false);
    let currentLineIndex = $state(0);

    const defaultPrompt = "$ ";
    const prompt = sequence?.prompt || defaultPrompt;

    // Default demo sequence
    const defaultSequence: TerminalSequence = {
        prompt: "$ ",
        commands: [
            { type: "input", text: "localdoc install rust", delay: 800 },
            {
                type: "output",
                text: "📦 Fetching rust.docpack from registry...",
                delay: 400,
            },
            {
                type: "success",
                text: "✓ Installed rust v1.70.0 (15,234 entries)",
                delay: 600,
            },
            { type: "input", text: "", delay: 500 },
            {
                type: "input",
                text: 'localdoc query "how to iterate over a vector"',
                delay: 1200,
            },
            { type: "output", text: "", delay: 100 },
            { type: "output", text: "🔍 Found 3 results:", delay: 200 },
            {
                type: "success",
                text: "  1. std::vec::Vec::iter() - Returns an iterator",
                delay: 150,
            },
            {
                type: "success",
                text: "  2. std::vec::Vec::iter_mut() - Mutable iterator",
                delay: 150,
            },
            {
                type: "success",
                text: "  3. for loop - Iterating over Vec<T>",
                delay: 150,
            },
            { type: "input", text: "", delay: 800 },
            {
                type: "input",
                text: 'localdoc query "django authentication"',
                delay: 1200,
            },
            {
                type: "error",
                text: "⚠ No docpack installed for django",
                delay: 400,
            },
            {
                type: "output",
                text: "💡 Install with: localdoc install django",
                delay: 300,
            },
            { type: "input", text: "", delay: 1000 },
        ],
    };

    const activeSequence = sequence || defaultSequence;

    async function typeText(text: string, lineIndex: number): Promise<void> {
        const line = lines[lineIndex];
        if (!line) return;

        for (let i = 0; i <= text.length; i++) {
            line.text = prompt + text.slice(0, i);
            await sleep(30 + Math.random() * 40); // Realistic typing speed variation
        }
        line.showCursor = false;
    }

    async function sleep(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async function runAnimation(): Promise<void> {
        if (isRunning) return;
        isRunning = true;
        lines = [];
        currentLineIndex = 0;

        for (const command of activeSequence.commands) {
            if (command.delay) {
                await sleep(command.delay);
            }

            const lineIndex = lines.length;

            if (command.type === "input") {
                // Add prompt line with cursor
                lines = [
                    ...lines,
                    { type: "input", text: prompt, showCursor: true },
                ];

                // Type the command
                if (command.text) {
                    await typeText(command.text, lineIndex);
                    await sleep(200); // Pause before "executing"
                }
            } else {
                // Output, success, or error - just appears
                lines = [
                    ...lines,
                    {
                        type: command.type,
                        text: command.text,
                        showCursor: false,
                    },
                ];
            }

            currentLineIndex++;
        }

        isRunning = false;

        // Loop if enabled
        if (loop) {
            await sleep(2000);
            runAnimation();
        }
    }

    $effect(() => {
        if (autoplay && !isRunning) {
            runAnimation();
        }
    });
</script>

<div class="terminal-container {className}">
    <div class="terminal-header">
        <div class="terminal-controls">
            <span class="control close"></span>
            <span class="control minimize"></span>
            <span class="control maximize"></span>
        </div>
        <div class="terminal-title">localdoc</div>
    </div>
    <div class="terminal-body">
        {#each lines as line, i (i)}
            <div class="terminal-line {line.type}">
                {line.text}
                {#if line.showCursor}
                    <span class="cursor">▊</span>
                {/if}
            </div>
        {/each}
    </div>
</div>

<style>
    .terminal-container {
        background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
        border-radius: 12px;
        overflow: hidden;
        box-shadow:
            0 20px 60px rgba(0, 0, 0, 0.5),
            0 0 0 1px rgba(255, 255, 255, 0.1);
        font-family: "SF Mono", "Monaco", "Cascadia Code", "Courier New",
            monospace;
        max-width: 800px;
        margin: 0 auto;
    }

    .terminal-header {
        background: #1e1e1e;
        padding: 12px 16px;
        display: flex;
        align-items: center;
        gap: 12px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .terminal-controls {
        display: flex;
        gap: 8px;
    }

    .control {
        width: 12px;
        height: 12px;
        border-radius: 50%;
    }

    .control.close {
        background: #ff5f57;
    }

    .control.minimize {
        background: #febc2e;
    }

    .control.maximize {
        background: #28c840;
    }

    .terminal-title {
        color: #888;
        font-size: 13px;
        flex: 1;
        text-align: center;
        margin-right: 44px; /* Balance the controls */
    }

    .terminal-body {
        padding: 20px;
        min-height: 400px;
        max-height: 600px;
        overflow-y: auto;
        font-size: 14px;
        line-height: 1.6;
    }

    .terminal-line {
        margin-bottom: 4px;
        white-space: pre-wrap;
        word-break: break-word;
    }

    .terminal-line.input {
        color: #e0e0e0;
    }

    .terminal-line.output {
        color: #888;
    }

    .terminal-line.success {
        color: #4ade80;
    }

    .terminal-line.error {
        color: #f87171;
    }

    .cursor {
        animation: blink 1s step-end infinite;
        color: #4ade80;
        margin-left: 2px;
    }

    @keyframes blink {
        0%,
        49% {
            opacity: 1;
        }
        50%,
        100% {
            opacity: 0;
        }
    }

    /* Scrollbar styling */
    .terminal-body::-webkit-scrollbar {
        width: 8px;
    }

    .terminal-body::-webkit-scrollbar-track {
        background: transparent;
    }

    .terminal-body::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
    }

    .terminal-body::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.2);
    }
</style>
