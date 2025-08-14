<script lang="ts">
	import { navStore } from '$lib/stores/navStore.js';
	import { onMount } from 'svelte';
	import ContentBlock from '$lib/components/ContentBlock.svelte';
	import type { ContentBlock as ContentBlockType, Issue } from '$lib/api';
	import { scrollStore } from '$lib/stores/scrollStore';

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

	let navState = $state<{
		issueText: string;
		showIssue: boolean;
		showNav: boolean;
		activeViews: {
			home: boolean;
			issue: boolean;
			index: boolean;
		};
	}>();

	let navContainer: HTMLDivElement;
	let navElement: HTMLElement;

	// Track previous showIssue so we can restore it when Index is toggled off
	let prevShowIssue: boolean | null = null;

	navStore.subscribe((value) => {
		navState = value;
	});

	const hasActiveViews = $derived(
		navState ? Object.values(navState.activeViews).some((active) => active) : false
	);

	$effect(() => {
		if (typeof document !== 'undefined') {
			if (hasActiveViews) {
				document.body.style.overflow = 'hidden';
			} else {
				document.body.style.overflow = '';
			}
		}
	});

	function toggleView(view: 'home' | 'issue' | 'index') {
		navStore.update((store) => ({
			...store,
			activeViews: {
				...store.activeViews,
				[view]: !store.activeViews[view]
			}
		}));
	}

	// Ensure Issue button is visible while Index is open and restore on close
	function toggleIndex() {
		navStore.update((store) => {
			const nextIndex = !store.activeViews.index;
			let newShowIssue = store.showIssue;
			if (nextIndex) {
				// Opening index: remember previous state and ensure Issue button is visible
				prevShowIssue = store.showIssue;
				newShowIssue = false;
			} else {
				// Closing index: restore previous showIssue if we captured it
				if (prevShowIssue !== null) {
					newShowIssue = prevShowIssue;
					prevShowIssue = null;
				}
			}
			return {
				...store,
				showIssue: newShowIssue,
				activeViews: {
					...store.activeViews,
					index: nextIndex
				}
			};
		});
	}

	function closeAllViews() {
		navStore.update((store) => ({
			...store,
			showIssue: prevShowIssue ?? store.showIssue,
			activeViews: { home: false, issue: false, index: false }
		}));
		prevShowIssue = null;
	}

	onMount(() => {
		// Function to set the nav height CSS variable
		const setNavHeight = () => {
			if (navElement) {
				const height = navElement.clientHeight;
				document.documentElement.style.setProperty('--nav-height', `${height}px`);
				console.log('Nav height set to:', height + 'px');
			}
		};

		// Set height immediately
		setNavHeight();

		// Also set height after a short delay to ensure nav is fully rendered
		const timeoutId = setTimeout(setNavHeight, 100);

		return () => {
			// Cleanup: restore body scroll on component unmount
			if (typeof document !== 'undefined') {
				document.body.style.overflow = '';
			}
			clearTimeout(timeoutId);
		};
	});
</script>

<nav class:hidden={!navState?.showNav} class:active={hasActiveViews} bind:this={navElement}>
	<div class="nav-container" bind:this={navContainer}>
		{#if isArticlePage}
			<!-- Article page layout: only show return in third column -->
			<div id="return" class="nav-item">
				<a
					href="/"
					onclick={() => {
						// Mark that we should restore scroll when we land on home
						scrollStore.update((s) => ({ ...s, shouldRestore: true }));
					}}
				>
					(return)
				</a>
			</div>
		{:else}
			<!-- Default layout: show home, issue, and index -->
			<div id="home" class="nav-item" class:active={navState?.activeViews.home}>
				<a href="/">
					<p>draught</p>
				</a>
			</div>
			<div
				id="issue"
				class="nav-item"
				class:active={navState?.activeViews.issue}
				hidden={!navState?.showIssue}
			>
				<button>
					<p>{navState?.issueText}</p>
				</button>
			</div>
			<div id="index" class="nav-item" class:active={navState?.activeViews.index}>
				<button onclick={toggleIndex}>
					<p>(index)</p>
				</button>
			</div>
		{/if}
	</div>

	<div class="nav-view">
		{#if navState?.activeViews.home}
			<div class="home-content">
				<div class="sentences">
					{#if sentences && sentences.length > 0}
						{#each sentences as sentence}
							<p>({sentence})</p>
						{/each}
					{/if}
				</div>
				<br />
				{#if about && about.length > 0}
					<div class="about">
						{#each about as block}
							<ContentBlock content={block} />
						{/each}
					</div>
				{/if}
			</div>
		{/if}
		{#if navState?.activeViews.issue}
			<div class="issue-content">
				{#if issues && issues.length > 0}
					{#each issues as issue}
						{#if issue.articles && issue.articles.length > 0}
							<div class="issue-section" style="--issue-color: {issue.color}">
								<p>{issue.title}</p>
								<br />
								<ul>
									{#each issue.articles as article}
										<a href={`article/${article.slug}`} onclick={closeAllViews}>
											<li data-cover={article.cover.url} data-alt-text={article.cover.alt}>
												<p>({article.tags})</p>
												<p>{article.title}</p>
												<p>{article.author}</p>
											</li>
										</a>
									{/each}
								</ul>
							</div>
						{/if}
					{/each}
				{/if}
			</div>
		{/if}
		{#if navState?.activeViews.index}
			<div class="index-content">
				<button onclick={() => toggleView('issue')}>(issues)</button>
				<p>(feature)</p>
				<p>(conversations)</p>
				<p>(studio visits)</p>
				<p>(portfolio)</p>
				<p>(detail)</p>
				<p>(wish I'd made)</p>
				<p>(adjacencies)</p>

				<br />
				<button onclick={() => toggleView('home')} id="about-btn">(about)</button>
			</div>
		{/if}
	</div>
</nav>

<style>
	nav {
		padding-inline: 1rem;
		padding-block-start: 1rem;
		width: 100%;
		/* max-width: calc(var(--content-width) * 80 / 100); */
		margin: 0 auto;
		position: fixed;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		background-color: var(--color-bg);
		border-bottom: 1px solid var(--color-border);
		z-index: 1000;
		transition:
			transform 0.3s ease-in-out,
			opacity 0.3s ease-in-out;
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
		max-height: 100dvh;
		height: 100dvh;
		overflow: hidden;
	}

	nav p {
		margin: 0;
	}

	#home a p {
		font-family: 'OTParellel-cursive', 'OTParellel', serif;
		font-style: italic;
		font-weight: 400;
		font-synthesis: none; /* don't fake italic/bold */
	}

	.nav-container {
		display: contents;
	}

	.nav-container > * {
		text-align: center;
		width: 100%;
	}

	.nav-container #home {
		grid-column: 1;
	}

	.nav-container #issue {
		grid-column: 2;
	}

	.nav-container #index {
		grid-column: 3;
	}

	.nav-container #return {
		grid-column: 3;
	}

	.nav-item button {
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.5rem;
		width: 100%;
		transition: background-color 0.2s ease;
	}

	.nav-item button:hover {
		background-color: var(--color-border);
	}

	.nav-item.active button {
		background-color: var(--color-border);
	}

	.nav-item a {
		display: block;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.5rem;
		width: 100%;
		transition: background-color 0.2s ease;
		text-decoration: none;
		color: inherit;
	}

	.nav-item a:hover {
		background-color: var(--color-border);
	}

	.nav-view {
		display: contents;
	}

	.home-content {
		grid-column: 1;
		grid-row: 2;
		padding: 1rem;
		max-height: calc(100dvh - 5rem);
		overflow-y: auto;
		scrollbar-width: none;
		-ms-overflow-style: none;
		border-top: 1px solid var(--color-border);
		background-color: var(--color-bg);
		animation: slideDown 0.3s ease-in-out;
		text-align: center;
		line-height: 23px;
	}

	.home-content::-webkit-scrollbar {
		display: none;
	}

	.home-content .about {
		text-align: left;
	}

	.issue-content {
		grid-column: 2;
		grid-row: 1 / -1; /* Span from top to bottom */
		padding: 1rem;
		max-height: calc(100dvh - 2rem);
		overflow-y: auto;
		scrollbar-width: none;
		-ms-overflow-style: none;
		border-top: 1px solid var(--color-border);
		border-left: 1px solid var(--color-border);
		border-right: 1px solid var(--color-border);
		background-color: var(--color-bg);
		animation: slideDown 0.3s ease-in-out;
		text-align: center;
		line-height: 23px;
		margin-top: -1rem; /* Counteract the nav padding-top */
		padding-top: 2rem; /* Add back some padding at the top */
	}

	.issue-content::-webkit-scrollbar {
		display: none;
	}

	.index-content {
		grid-column: 3;
		grid-row: 2;
		padding: 1rem;
		max-height: calc(100dvh - 5rem);
		overflow-y: auto;
		scrollbar-width: none;
		-ms-overflow-style: none;
		border-top: 1px solid var(--color-border);
		background-color: var(--color-bg);
		animation: slideDown 0.3s ease-in-out;
		text-align: center;
		line-height: 23px;
	}

	.index-content::-webkit-scrollbar {
		display: none;
	}

	.index-content button {
		border: none;
		background: none;
		color: inherit;
		padding: 0;
		cursor: pointer;
	}

	.issue-section {
		color: var(--issue-color, #000000);
		margin-bottom: 2rem;
	}

	.issue-section:last-child {
		margin-bottom: 0;
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.nav-view ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.nav-view li {
		padding: 0.5rem 0;
		border-bottom: 1px solid var(--color-border);
	}

	.nav-view li:last-child {
		border-bottom: none;
	}
</style>
