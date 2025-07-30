<script lang="ts">
	import Nav from '../lib/components/Nav.svelte';
	import type { LayoutData } from './$types';

	let { children, data }: { children: any; data: LayoutData } = $props();
</script>

<Nav about={data.props?.site?.about} sentences={data.props?.site?.sentences} />
<main>
	{@render children()}
</main>

<style>
	main {
		max-width: var(--content-width);
		margin: 0 auto;
	}
</style>
