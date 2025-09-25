<script lang="ts">
	import { navStore } from '$lib/stores/navStore.js';
	import { onMount } from 'svelte';
	import type { ContentBlock as ContentBlockType, Issue } from '$lib/api';
	import type { ArticlePreview } from './composables/useArticles.js';

	// Import our new modular components
	import NavHeader from './NavHeader.svelte';
	import HomeView from './views/HomeView.svelte';
	import IssueView from './views/IssueView.svelte';
	import IndexView from './views/IndexView.svelte';

	// Import composables
	import { useNavigation } from './composables/useNavigation.js';
	import { useArticles } from './composables/useArticles.js';

	const {
		about,
		sentences,
		issues,
		isArticlePage = false
	}: {
		about?: ContentBlockType[];
		sentences?: string[];
		issues?: Issue[];
		isArticlePage?: boolean;
	} = $props();

	// Initialize composables
	const navigation = useNavigation();
	const articles = useArticles();

	const showHomeView = navigation.showHomeView;

	// Article hover state (reactive)
	let hoveredArticle = $state<ArticlePreview | null>(null);
	let isMobile = $state(false);

	function handleArticleHover(article: ArticlePreview) {
		// Only show hover preview on desktop
		if (!isMobile) {
			hoveredArticle = article;
		}
	}

	function handleArticleLeave() {
		if (!isMobile) {
			hoveredArticle = null;
		}
	}

	function checkMobileView() {
		if (typeof window !== 'undefined') {
			isMobile = window.innerWidth <= 768;
		}
	}

	// Reactive state
	let navState = $state<any>();
	let navElement: HTMLElement;

	// Derived values
	const uniqueTags = $derived(articles.getUniqueTags(issues));
	const hasActiveViews = $derived(
		navState ? Object.values(navState.activeViews).some((active) => Boolean(active)) : false
	);

	// Subscribe to nav store
	navStore.subscribe((value) => {
		navState = value;
	});

	// Handle body overflow when nav is active
	$effect(() => {
		if (typeof document !== 'undefined') {
			document.body.style.overflow = hasActiveViews ? 'hidden' : '';
		}
	});

	// Mount lifecycle
	onMount(() => {
		const setNavHeight = () => {
			if (navElement) {
				const height = navElement.clientHeight;
				document.documentElement.style.setProperty('--nav-height', `${height}px`);
			}
		};

		// Check mobile view on mount and add resize listener
		checkMobileView();
		const handleResize = () => {
			checkMobileView();
			// Clear hover state when switching to mobile
			if (isMobile && hoveredArticle) {
				hoveredArticle = null;
			}
		};

		window.addEventListener('resize', handleResize);

		setNavHeight();
		const timeoutId = setTimeout(setNavHeight, 100);

		return () => {
			if (typeof document !== 'undefined') {
				document.body.style.overflow = '';
			}
			window.removeEventListener('resize', handleResize);
			clearTimeout(timeoutId);
		};
	});
</script>

<nav class:hidden={!navState?.showNav} class:active={hasActiveViews} bind:this={navElement}>
	<NavHeader
		{isArticlePage}
		{navState}
		onNavigateHome={navigation.navigateHome}
		onShowHome={showHomeView}
		onToggleIndex={navigation.toggleIndex}
	/>

	<div class="nav-view">
		{#if hasActiveViews}
		{#if navState?.activeViews.home || (!isMobile && hoveredArticle)}
			<HomeView
				{about}
				{sentences}
				{hoveredArticle}
				fullWidth={navState?.activeViews.home && !navState?.activeViews.issue && !navState?.activeViews.index}
			/>
		{/if}

			{#if navState?.activeViews.issue}
				<IssueView
					{issues}
					selectedTag={navState?.selectedTag}
					onCloseAllViews={navigation.closeAllViews}
					onArticleHover={handleArticleHover}
					onArticleLeave={handleArticleLeave}
				/>
			{/if}

			{#if navState?.activeViews.index}
				<IndexView
					{uniqueTags}
					onShowView={navigation.showView}
					onShowIssuesWithoutFilter={navigation.showIssuesWithoutFilter}
					onTagFilter={navigation.setSelectedTag}
				/>
			{/if}
		{/if}
	</div>
</nav>

<style>
	nav {
		padding-block-start: 1rem;
		width: 100%;
		margin: 0 auto;
		position: fixed;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		background-color: var(--color-bg);
		border-bottom: 1px solid var(--color-border);
		z-index: 1000;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: min-content 1fr;
		gap: 1rem;
	}

	nav.hidden {
		transform: translateX(-50%) translateY(-100%);
		opacity: 0;
		pointer-events: none;
	}

	nav.active {
		background-color: white;
		padding-inline-end: var(--scroll-bar-width);
		max-height: 100dvh;
		height: 100dvh;
		overflow: hidden;
	}

	.nav-view {
		display: contents;
	}

	@media (max-width: 768px) {
		nav {
			padding-inline: 0.25rem;
		}
		nav.active {
			max-height: 100dvh;
			height: 100dvh;
		}
	}
</style>
