<script lang="ts">
	import Nav from '../lib/components/Nav.svelte';
	let { children } = $props();
</script>

<Nav />
<main>
	{@render children()}
</main>

<style>
	main {
		max-width: var(--content-width);
		margin: 0 auto;
	}
</style>
