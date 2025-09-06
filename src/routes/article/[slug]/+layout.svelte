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
				showNav: true,
				issueColor: '#181818'
			}));
		}
		// Optional: Clean up when leaving the article route
		return () => {
			// You can choose to hide nav when leaving or keep it visible
			// navStore.update((store) => ({ ...store, showNav: false }));
		};
	});
</script>

<div class="article-layout">
	{@render children()}
</div>

<style>
	.article-layout {
		width: 100%;
	}

	/* The global styles for main have been moved to an external file */
</style>
