<script lang="ts">
	import { onMount } from 'svelte';
	import { navStore } from '$lib/stores/navStore';

	let { children }: { children: any } = $props();

	onMount(() => {
		// Set showNav to true when on accessibility page
		navStore.update((store) => ({
			...store,
			showNav: true,
			issueColor: '#181818'
		}));
	});
</script>

<div class="accessibility-layout">
	{@render children()}
</div>

<style>
	.accessibility-layout {
		width: 100%;
	}
</style>
