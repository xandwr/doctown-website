<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	onMount(() => {
		// Clear onboarding flag from sessionStorage
		sessionStorage.removeItem('onboarding_dismissed');

		// Redirect to server-side logout endpoint
		goto('/auth/logout/confirm');
	});
</script>

<div class="flex items-center justify-center min-h-screen">
	<p class="text-lg">Logging out...</p>
</div>
