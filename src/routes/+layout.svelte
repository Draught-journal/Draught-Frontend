<script lang="ts">
	import { page } from '$app/state';
	import Nav from '$lib/components/navigation/Nav.svelte';
	import type { LayoutData } from './$types';
	import { beforeNavigate, afterNavigate } from '$app/navigation';
	import { scrollStore } from '$lib/stores/scrollStore';
	import { navStore } from '$lib/stores/navStore';

	let { children, data }: { children: any; data: LayoutData } = $props();

	// Check if current route is an article page
	const isArticlePage = $derived(page.route.id?.includes('/article/[slug]') ?? false);

	// Capture scroll position when leaving home for an article
	beforeNavigate((nav) => {
		if (typeof window === 'undefined') return;
		// We only care about client-side link/goto navigations
		if (nav.to && nav.to.url.pathname.startsWith('/article/') && page.url.pathname === '/') {
			scrollStore.update((s) => ({ ...s, homeScrollY: window.scrollY }));
			console.log('Navigating away, captured scroll if needed', page.url.pathname, nav);
		}

		// Close any open nav views when navigating to an article
		if (nav.to && nav.to.url.pathname.startsWith('/article/')) {
			navStore.update((store) => ({
				...store,
				activeViews: { home: false, issue: false, index: false }
			}));
		}
	});

	// Restore scroll when returning to home if flag is set
	afterNavigate(() => {
		if (typeof window === 'undefined') return;
		if (page.url.pathname === '/') {
			scrollStore.update((s) => {
				if (s.shouldRestore && s.homeScrollY !== null) {
					// Defer to next frame to ensure DOM is rendered
					const y = s.homeScrollY ?? 0;
					requestAnimationFrame(() => {
						window.scrollTo({ top: y, left: 0, behavior: 'auto' });
					});
					return { homeScrollY: null, shouldRestore: false };
				}
				return s;
			});
			console.log('Returned to home, restored scroll if needed');
		}
	});
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
