<script lang="ts">
	import { navStore } from '../stores/navStore.js';
	import { onMount } from 'svelte';
	import ContentBlock from './ContentBlock.svelte';
	import type { ContentBlock as ContentBlockType, Issue } from '$lib/api';

	const {
		about,
		sentences,
		issues
	}: { about?: ContentBlockType[]; sentences?: string[]; issues?: Issue[] } = $props();

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

	onMount(() => {
		return () => {
			// Cleanup: restore body scroll on component unmount
			if (typeof document !== 'undefined') {
				document.body.style.overflow = '';
			}
		};
	});
</script>

<nav class:hidden={!navState?.showNav} class:active={hasActiveViews}>
	<div class="nav-container">
		<div id="home" class="nav-item" class:active={navState?.activeViews.home}>
			<button onclick={() => toggleView('home')}>
				<p><i>draught</i></p>
			</button>
		</div>
		<div
			id="issue"
			class="nav-item"
			class:active={navState?.activeViews.issue}
			hidden={!navState?.showIssue}
		>
			<button onclick={() => toggleView('issue')}>
				<p>{navState?.issueText}</p>
			</button>
		</div>
		<div id="index" class="nav-item" class:active={navState?.activeViews.index}>
			<button onclick={() => toggleView('index')}>
				<p>(index)</p>
			</button>
		</div>
	</div>

	<div class="nav-view">
		{#if navState?.activeViews.home}
			<div class="home-content nav-content-base">
				<div class="sentences">
					{#if sentences && sentences.length > 0}
						{#each sentences as sentence}
							<p>({sentence})</p>
						{/each}
					{/if}
				</div>
				<br />
				{#if about && about.length > 0}
					{#each about as block}
						<ContentBlock content={block} />
					{/each}
				{/if}
			</div>
		{/if}
		{#if navState?.activeViews.issue}
			<div class="issue-content nav-content-base">
				{#if issues && issues.length > 0}
					{#each issues as issue}
						{#if issue.articles && issue.articles.length > 0}
							<div class="issue-section" style="--issue-color: {issue.color}">
								<ul>
									{#each issue.articles as article}
										<li>
											<p>({article.tags})</p>
											<p>{article.title}</p>
											<p>{article.author}</p>
										</li>
									{/each}
								</ul>
							</div>
						{/if}
					{/each}
				{/if}
			</div>
		{/if}
		{#if navState?.activeViews.index}
			<div class="index-content nav-content-base">
				<p>(issues)</p>
				<p>(feature)</p>
				<p>(conversations)</p>
				<p>(studio visits)</p>
				<p>(portfolio)</p>
				<p>(detail)</p>
				<p>(wish I'd made)</p>
				<p>(adjacencies)</p>
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
		row-gap: 1rem;
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

	.nav-view {
		display: grid;
		height: 100%;
		grid-template-columns: subgrid;
		grid-column: 1 / -1;
		/* padding: 1rem 0; */
		background-color: var(--color-bg);
		border-top: 1px solid var(--color-border);
		animation: slideDown 0.3s ease-in-out;
		text-align: center;
	}

	/* Shared styles for all nav content sections */
	.nav-content-base {
		padding: 0 1rem;
		max-height: calc(100dvh - 5rem);
		overflow-y: auto;
		scrollbar-width: none; /* Firefox */
		-ms-overflow-style: none; /* IE and Edge */
	}

	.nav-content-base::-webkit-scrollbar {
		display: none; /* Chrome, Safari, Opera */
	}

	.home-content {
		grid-column: 1;
	}

	.issue-content {
		grid-column: 2;
	}

	.index-content {
		grid-column: 3;
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
