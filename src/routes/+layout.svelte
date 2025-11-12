<script lang="ts">
    import "../app.css";
    import favicon from "$lib/assets/favicon.svg";
    import Header from "$lib/components/Header.svelte";
    import type { SessionUser } from "$lib/types";

    interface LayoutData {
        user?: SessionUser | null;
    }

    let { children, data }: { children: any; data: LayoutData } = $props();
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
</svelte:head>

<Header user={data.user} />
{@render children()}
