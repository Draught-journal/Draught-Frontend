<script lang="ts">
	import { page } from '$app/stores';
	import Nav from '../lib/components/navigation/Nav.svelte';
	import type { LayoutData } from './$types';

	let { children, data }: { children: any; data: LayoutData } = $props();

	// Check if current route is an article page
	const isArticlePage = $derived($page.route.id?.includes('/article/[slug]') ?? false);
</script>

<Nav
	about={data.props?.site?.about}
	sentences={data.props?.site?.sentences}
	issues={data.props?.site?.issues}
	{isArticlePage}
/>
<main>
	{@render children()}
</main>

<style>
	main {
		max-width: var(--content-width);
		margin: 0 auto;
	}
</style>
