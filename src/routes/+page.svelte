<script lang="ts">
</script>

<main class="landing">
    <!-- Hero: Immediate Hook -->
    <section class="hero">
        <div class="container">
            <h1>Documentation is a dependency.</h1>
            <p class="subhero">Let's treat it like one.</p>
        </div>
    </section>

    <!-- The Manifesto: Why This Exists -->
    <section class="manifesto">
        <div class="container">
            <h2>Why Doctown exists.</h2>
            <div class="manifesto-content">
                <p>
                    Corporate documentation is a scam. A business model dressed
                    as a public good.
                </p>
                <p>
                    You don't need a dashboard to search a string. You don't
                    need a login to read a function signature. You don't need
                    cookie banners, analytics trackers, and 2MB of JavaScript to
                    find out how <code>async/await</code> works.
                </p>
                <p>
                    You don't need <a
                        href="https://www.gitbook.com/pricing"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-neutral-600">GitBook</a
                    >
                    upselling you on "team seats." You don't need
                    <a
                        href="https://www.mintlify.com/pricing"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-green-200">Mintlify</a
                    >
                    charging you $250/month to host your docs. You don't need
                    <a
                        href="https://www.atlassian.com/software/confluence"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-blue-500">Confluence</a
                    >
                    making you click through three dropdowns to copy a code snippet.
                </p>
                <p>
                    Docs should be <strong>local</strong>,
                    <strong>fast</strong>, and <strong>offline</strong>. They
                    should live in your terminal, not on a dashboard.
                </p>
                <p>
                    <strong>Localdoc is the alternative.</strong> A CLI you own.
                    Docs on a platform that you, the people, help control.
                </p>
                <p>
                    Save yourself another documentation-related "meditation
                    walk". You'll thank us.
                </p>
            </div>
        </div>
    </section>

    <!-- The Model: Free vs Premium -->
    <section class="model">
        <div class="container">
            <h2>The model.</h2>
            <p class="model-principle">
                <strong>Consumption is free. Creation is paid.</strong>
            </p>
            <div class="model-grid">
                <div class="model-column free">
                    <h3>Free. Forever.</h3>
                    <ul>
                        <li>Install unlimited docpacks</li>
                        <li>CLI tool (open source)</li>
                        <li>Offline doc queries</li>
                        <li>Local-first. No tracking.</li>
                        <li>Search and discover all public docpacks</li>
                    </ul>
                    <p class="model-note">Everything you need to build.</p>
                    <p class="model-limit opacity-60">
                        Cannot publish docpacks.
                    </p>
                </div>
                <div class="model-column premium">
                    <h3>Creator Tier. $12/mo.</h3>
                    <ul>
                        <li>Publish unlimited docpacks</li>
                        <li>AI auto-generates docpacks from GitHub repos</li>
                        <li>Monthly compute tokens</li>
                        <li>Creator dashboard with analytics</li>
                        <li>Verified badge (GitHub-linked)</li>
                        <li>Priority support</li>
                    </ul>
                    <p class="text-cyan-400">
                        AI saves you hours of time writing documentation for
                        large projects.<br />
                        Link repo → Get docpack.
                    </p>
                </div>
            </div>
            <p class="model-philosophy">
                <strong>You're not paying for hosting.</strong><br />
                You're paying for
                <b
                    >an AI agent that reads your codebase and generates
                    production-ready documentation automatically</b
                >. No more manual doc writing. No more copy-pasting between
                formats. <br /> Link your repo, allocate tokens, publish in
                minutes. <br />
                <br />
            </p>

            <p class="text-blue-800 mb-4">
                Instant global availability is just a bonus.
            </p>

            <p class="model-philosophy">
                <strong>Like npm. For docs.</strong><br />
                Anyone can install for free. Only creators pay—and they get automation
                that makes it worth every cent.
            </p>
        </div>
    </section>

    <!-- Call to Action -->
    <section class="cta">
        <div class="container">
            <h2>Join the revolution.</h2>
            <div class="terminal">
                <div class="terminal-line">$ cargo install localdoc</div>
            </div>
            <p class="cta-note">Documentation for people who build.</p>
        </div>
    </section>

    <!-- Footer -->
    <section class="footer">
        <div class="container">
            <p>
                Built by crazy (<a
                    href="https://github.com/xandwr"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-blue-200">xandwr</a
                >) to keep others sane.
            </p>
            <p class="footer-links">
                <a
                    href="https://github.com/xandwr/doctown-monorepo"
                    target="_blank"
                    rel="noopener">GitHub</a
                >
                <span>•</span>
                <a
                    href="https://discord.gg/r8rbntTaKQ"
                    target="_blank"
                    rel="noopener">Discord</a
                >
            </p>
        </div>
    </section>
</main>

<style>
    :global(body) {
        margin: 0;
        background: #000;
        color: #fff;
        font-family:
            "IBM Plex Mono", "SF Mono", "Monaco", "Cascadia Code", monospace;
        overflow-x: hidden;
        -webkit-font-smoothing: antialiased;
    }

    .landing {
        min-height: 100vh;
    }

    .container {
        max-width: 900px;
        margin: 0 auto;
        padding: 0 24px;
    }

    section {
        padding: 80px 0;
        border-top: 1px solid #111;
    }

    section:first-child {
        border-top: none;
    }

    h2 {
        font-size: 32px;
        font-weight: 400;
        margin: 0 0 40px 0;
        color: #fff;
        letter-spacing: -0.02em;
    }

    /* Hero */
    .hero {
        min-height: 90vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 60px 0;
    }

    .hero h1 {
        font-size: 48px;
        font-weight: 400;
        line-height: 1.2;
        margin: 0 0 24px 0;
        letter-spacing: -0.03em;
        color: #fff;
    }

    .subhero {
        font-size: 20px;
        color: #666;
        margin: 0;
        line-height: 1.5;
    }

    .terminal {
        background: #000;
        border: 1px solid #333;
        padding: 24px;
        font-size: 14px;
        line-height: 1.8;
        margin-bottom: 24px;
        overflow-x: auto;
    }

    .terminal-line {
        color: #fff;
        white-space: nowrap;
    }

    /* Manifesto */
    .manifesto {
        padding: 100px 0;
    }

    .manifesto-content {
        max-width: 700px;
    }

    .manifesto-content p {
        font-size: 18px;
        color: #ccc;
        line-height: 1.7;
        margin: 0 0 24px 0;
    }

    .manifesto-content p:last-child {
        margin-bottom: 0;
    }

    .manifesto-content strong {
        color: #fff;
        font-weight: 400;
    }

    .manifesto-content code {
        background: #111;
        padding: 2px 6px;
        border-radius: 3px;
        color: #0f0;
        font-size: 0.95em;
    }

    /* Model */
    .model {
        padding: 100px 0;
    }

    .model-principle {
        font-size: 20px;
        color: #ccc;
        text-align: center;
        margin: 0 0 60px 0;
        line-height: 1.5;
    }

    .model-principle strong {
        color: #fff;
        font-weight: 400;
    }

    .model-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 48px;
        margin-bottom: 48px;
    }

    .model-column h3 {
        font-size: 24px;
        font-weight: 400;
        margin: 0 0 20px 0;
        color: #fff;
    }

    .model-column ul {
        list-style: none;
        padding: 0;
        margin: 0 0 20px 0;
    }

    .model-column li {
        font-size: 16px;
        color: #999;
        line-height: 1.8;
        padding-left: 20px;
        position: relative;
    }

    .model-column li::before {
        content: "→";
        position: absolute;
        left: 0;
        color: #666;
    }

    .model-column.premium li::before {
        color: #0f0;
    }

    .model-note {
        font-size: 14px;
        color: #666;
        margin: 0;
        font-style: italic;
        line-height: 1.5;
    }

    .model-limit {
        font-size: 14px;
        color: #f00;
        margin: 12px 0 0 0;
        font-style: italic;
    }

    .model-philosophy {
        font-size: 18px;
        color: #999;
        line-height: 1.7;
        margin: 0 0 24px 0;
        padding-top: 32px;
        border-top: 1px solid #222;
    }

    .model-philosophy:last-child {
        margin-bottom: 0;
    }

    .model-philosophy strong {
        color: #fff;
    }

    /* CTA */
    .cta {
        padding: 60px 0;
        text-align: center;
    }

    .cta h2 {
        margin-bottom: 32px;
    }

    .cta .terminal {
        max-width: 500px;
        margin: 0 auto 24px auto;
        text-align: left;
    }

    .cta-note {
        font-size: 16px;
        color: #666;
        margin: 0;
        line-height: 1.6;
    }

    /* Footer */
    .footer {
        padding: 60px 0;
        text-align: center;
        border-top: 1px solid #222;
    }

    .footer p {
        font-size: 14px;
        color: #666;
        margin: 0 0 12px 0;
    }

    .footer-links {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
    }

    .footer-links a {
        color: #999;
        text-decoration: none;
        transition: color 0.2s;
    }

    .footer-links a:hover {
        color: #fff;
    }

    .footer-links span {
        color: #333;
    }

    /* Desktop Breakpoint */
    @media (min-width: 768px) {
        .container {
            padding: 0 60px;
        }

        section {
            padding: 120px 0;
        }

        .hero {
            min-height: 100vh;
            padding: 80px 0;
        }

        .hero h1 {
            font-size: 72px;
        }

        .subhero {
            font-size: 24px;
        }

        h2 {
            font-size: 48px;
            margin-bottom: 60px;
        }

        .terminal {
            padding: 40px;
            font-size: 16px;
        }

        .model-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 60px;
        }

        .manifesto-content p {
            font-size: 20px;
        }

        .model-philosophy {
            font-size: 20px;
        }
    }

    /* Large Desktop */
    @media (min-width: 1200px) {
        .hero h1 {
            font-size: 96px;
        }
    }
</style>
