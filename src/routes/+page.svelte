<script lang="ts">
</script>

<main class="landing">
    <!-- Hero: Immediate Hook -->
    <section class="hero">
        <div class="container">
            <h1>Documentation without dependency.</h1>
            <p class="subhero">
                All documentation. One CLI. No corporate bullshit.
            </p>
        </div>
    </section>

    <!-- Quick Start: Get Devs Moving in 10 Seconds -->
    <section class="quickstart">
        <div class="container">
            <h2>Get going. Fast.</h2>
            <div class="terminal">
                <div class="terminal-line">$ cargo install localdoc</div>
                <div class="terminal-line output">
                    ✓ installed localdoc v0.1.0
                </div>
                <div class="terminal-line">&nbsp;</div>
                <div class="terminal-line">$ localdoc install rust</div>
                <div class="terminal-line output">
                    ✓ rust@1.70.0 (15,234 entries)
                </div>
                <div class="terminal-line">&nbsp;</div>
                <div class="terminal-line">
                    $ localdoc query "iterate vector"
                </div>
                <div class="terminal-line output">std::vec::Vec::iter()</div>
                <div class="terminal-line output">
                    std::vec::Vec::iter_mut()
                </div>
                <div class="terminal-line output">for x in &vec</div>
            </div>
            <p class="quickstart-note">
                That's it. Docs in your terminal. Offline. Forever.
            </p>
        </div>
    </section>

    <!-- Hall of Shame: Calling Shots -->
    <section class="shame">
        <div class="container">
            <h2>If you've felt this, you already know.</h2>
            <div class="shame-list">
                <div class="shame-item">
                    <p class="shame-target">ReadMe.io</p>
                    <p class="shame-crime">
                        $99/mo to host markdown. A glorified CMS that makes you
                        refresh the page to see search results. Your docs
                        deserve better than a SaaS jailcell.
                    </p>
                </div>
                <div class="shame-item">
                    <p class="shame-target">Stripe Docs</p>
                    <p class="shame-crime">
                        Beautiful design. Useless search. Try finding which
                        webhook event actually fires first. Go ahead. We'll
                        wait.
                    </p>
                </div>
                <div class="shame-item">
                    <p class="shame-target">Square API Sandbox</p>
                    <p class="shame-crime">
                        Built a payments empire. Can't make a testing
                        environment that loads in under 10 seconds. Spinners
                        don't pay rent.
                    </p>
                </div>
                <div class="shame-item">
                    <p class="shame-target">AWS Docs</p>
                    <p class="shame-crime">
                        17 tabs open. Still don't know if you need IAM:PassRole.
                        The search gives you 900 results. None of them answer
                        your question.
                    </p>
                </div>
                <div class="shame-item">
                    <p class="shame-target">Stack Overflow</p>
                    <p class="shame-crime">
                        "Marked as duplicate." The linked answer is from 2011
                        and doesn't work. Mods won't let you ask again. Ship
                        your rage into a CLI instead.
                    </p>
                </div>
            </div>
            <p class="shame-manifesto">
                You're not the problem. The docs are.<br />
                <strong>We're fixing it.</strong>
            </p>
        </div>
    </section>

    <!-- The Pitch: What This Is -->
    <section class="pitch">
        <div class="container">
            <div class="pitch-grid">
                <div class="pitch-item">
                    <h3>100% offline</h3>
                    <p>No network. No latency. No tracking.</p>
                </div>
                <div class="pitch-item">
                    <h3>&lt;50ms queries</h3>
                    <p>Faster than grep. Smarter than find.</p>
                </div>
                <div class="pitch-item">
                    <h3>Zero config</h3>
                    <p>One binary. One command. Done.</p>
                </div>
            </div>
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
                    You don't need GitBook upselling you on "team seats." You
                    don't need ReadMe charging $99/mo to render markdown. You
                    don't need Confluence making you click through three
                    dropdowns to copy a code snippet.
                </p>
                <p>
                    Docs should be <strong>local</strong>,
                    <strong>fast</strong>, and <strong>offline</strong>. They
                    should live in your terminal—not behind a paywall, not in a
                    Notion workspace with broken search, not in some VC-funded
                    "knowledge graph" that'll pivot to AI in six months and rug
                    you by Q3.
                </p>
                <p>
                    <strong>Localdoc is the alternative.</strong> A CLI you own.
                    Docs you control. No middleman. No metrics. No investors demanding
                    10x growth on your search queries.
                </p>
                <p>
                    If you've ever rage-closed a docs site because it <em
                        >just wouldn't fucking load</em
                    >—this is for you.
                </p>
            </div>
        </div>
    </section>

    <!-- The Model: Free vs Premium -->
    <section class="model">
        <div class="container">
            <h2>The model.</h2>
            <div class="model-grid">
                <div class="model-column free">
                    <h3>Free. Forever.</h3>
                    <ul>
                        <li>CLI tool (open source)</li>
                        <li>Offline doc queries</li>
                        <li>Core docpacks (Rust, Python, etc.)</li>
                        <li>Local-first. No tracking.</li>
                    </ul>
                    <p class="model-note">Everything you need to build.</p>
                </div>
                <div class="model-column premium">
                    <h3>Premium. For velocity.</h3>
                    <ul>
                        <li>AI semantic search (token-optimized)</li>
                        <li>Cloud sync & auto-updates</li>
                        <li>Private docpack registry</li>
                        <li>Priority support</li>
                    </ul>
                    <p class="model-note">Buy hours. Not features.</p>
                </div>
            </div>
            <p class="model-philosophy">
                <strong>OSS at the edges. Product at the core.</strong><br />
                The free layer proves it works. The premium layer keeps the lights
                on.
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
            <p class="cta-note">
                Documentation for people who build.<br />
                Not corporations who extract.
            </p>
        </div>
    </section>

    <!-- Footer -->
    <section class="footer">
        <div class="container">
            <p>
                Built by someone who has lost their mind, for people who are on
                the verge themselves.
            </p>
            <p class="footer-links">
                <a
                    href="https://github.com/xandwr/doctown-monorepo"
                    target="_blank"
                    rel="noopener">GitHub</a
                >
                <span>•</span>
                <span class="coming-soon">Docs (soon)</span>
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
        font-family: "IBM Plex Mono", "SF Mono", "Monaco", "Cascadia Code",
            monospace;
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

    /* Quick Start */
    .quickstart h2 {
        margin-bottom: 32px;
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

    .terminal-line.output {
        color: #666;
        padding-left: 16px;
    }

    .quickstart-note {
        font-size: 16px;
        color: #999;
        margin: 0;
        line-height: 1.6;
    }

    /* Hall of Shame */
    .shame {
        background: #0a0a0a;
        padding: 100px 0;
    }

    .shame h2 {
        margin-bottom: 60px;
    }

    .shame-list {
        display: grid;
        grid-template-columns: 1fr;
        gap: 40px;
        margin-bottom: 60px;
    }

    .shame-item {
        border-left: 2px solid #f00;
        padding-left: 20px;
    }

    .shame-target {
        font-size: 20px;
        color: #f00;
        font-weight: 400;
        margin: 0 0 12px 0;
        letter-spacing: -0.01em;
    }

    .shame-crime {
        font-size: 16px;
        color: #999;
        line-height: 1.7;
        margin: 0;
    }

    .shame-manifesto {
        font-size: 20px;
        color: #ccc;
        line-height: 1.6;
        margin: 0;
        padding-top: 40px;
        border-top: 1px solid #222;
        text-align: center;
    }

    .shame-manifesto strong {
        color: #fff;
    }

    /* Pitch */
    .pitch-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 48px;
    }

    .pitch-item h3 {
        font-size: 24px;
        font-weight: 400;
        margin: 0 0 12px 0;
        color: #fff;
    }

    .pitch-item p {
        font-size: 16px;
        color: #666;
        margin: 0;
        line-height: 1.6;
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

    .manifesto-content em {
        color: #fff;
        font-style: italic;
    }

    /* Model */
    .model {
        padding: 100px 0;
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
    }

    .model-philosophy {
        font-size: 18px;
        color: #999;
        line-height: 1.7;
        margin: 0;
        padding-top: 32px;
        border-top: 1px solid #222;
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

    .footer-links .coming-soon {
        color: #555;
        font-style: italic;
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

        .pitch-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 60px;
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

        .shame h2 {
            margin-bottom: 80px;
        }

        .shame-list {
            grid-template-columns: repeat(2, 1fr);
            gap: 60px;
            margin-bottom: 80px;
        }

        .shame-target {
            font-size: 24px;
        }

        .shame-crime {
            font-size: 18px;
        }

        .shame-manifesto {
            font-size: 24px;
        }
    }

    /* Large Desktop */
    @media (min-width: 1200px) {
        .hero h1 {
            font-size: 96px;
        }
    }
</style>
