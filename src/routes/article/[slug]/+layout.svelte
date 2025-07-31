<script lang="ts">
	import { onMount } from 'svelte';
	import { navStore } from '$lib/stores/navStore';
	import type { LayoutData } from './$types';

	let { children, data }: { children: any; data: LayoutData } = $props();

	onMount(() => {
		// Set showNav to true when on article pages
		if (data.showNav) {
			navStore.update((store) => ({
				...store,
				showNav: true
			}));
		}

		// Optional: Clean up when leaving the article route
		return () => {
			// You can choose to hide nav when leaving or keep it visible
			// navStore.update((store) => ({ ...store, showNav: false }));
		};
	});
</script>

<main>
	{@render children()}
</main>

<style>
	main {
		max-width: var(--content-width, 1200px);
		margin-inline: auto;
	}
</style>
