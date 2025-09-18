<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import ArticleCard from './ArticleCard.svelte';
	import LazyImage from './ui/LazyImage.svelte';
	import { navStore } from '$lib/stores/navStore.js';
	import type { Article } from '$lib/api';

	// Threshold in pixels for when the nav should appear (distance from top of viewport)
	const NAV_THRESHOLD = 310;

	type GridItem = {
		row: number;
		col: number;
		label: string;
	};

	let {
		issueColor = '#000000',
		issueTitle = 'issue one',
		grid = '[]',
		articles = []
	}: {
		issueColor?: string;
		issueTitle?: string;
		grid?: string;
		articles?: Article[];
	} = $props();

	// Parse grid JSON if it's a string
	const gridConfig = $derived(typeof grid === 'string' ? JSON.parse(grid) : grid) as GridItem[];

	// For demo purposes, create 8 issues if none provided
	const displayIssues = $derived(articles.length > 0 ? articles : (Array(8).fill({}) as Article[]));

	let issueNumElement: HTMLDivElement;
	let observer: IntersectionObserver;
	// Track if nav is visible (to conditionally hide the issue number)
	let isNavVisible = $state(false);
	// Track if user has scrolled past the element at least once
	let hasScrolledPast = $state(false);
	const images = $derived(
		articles
			.filter((article) => article.cover && article.cover.url)
			.map((article) => ({
				url: article.cover.url,
				alt: article.cover.alt || `Cover image for ${article.title}`,
				articleUrl: article.slug ? `/article/${article.slug}` : '#',
				coverSize: article.coverSize || 'medium'
			}))
	);

	onMount(() => {
		if (issueNumElement) {
			// Ensure nav is hidden initially
			navStore.update((store) => ({
				...store,
				showNav: false,
				showIssue: false
			}));
			isNavVisible = false;

			// Simple IntersectionObserver - when element goes out of view, show nav
			observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.target === issueNumElement) {
							const issueText = entry.target.textContent?.trim() || '';

							// If element is intersecting (visible), mark that we've seen it
							if (entry.isIntersecting) {
								hasScrolledPast = false;
							} else {
								// Element is not intersecting (out of view)
								// Only show nav if we've scrolled past it (not on initial load)
								if (hasScrolledPast || entry.boundingClientRect.top < 0) {
									hasScrolledPast = true;
								}
							}

							// Only show nav if we've confirmed the user scrolled past
							const shouldShowNav = !entry.isIntersecting && hasScrolledPast;

							// Update both our local state and the store
							isNavVisible = shouldShowNav;

							navStore.update((store) => ({
								...store,
								issueText,
								showNav: shouldShowNav,
								showIssue: shouldShowNav,
								issueColor
							}));
						}
					});
				},
				{
					threshold: 0,
					rootMargin: `-${NAV_THRESHOLD}px 0px 0px 0px`
				}
			);

			observer.observe(issueNumElement);
		}
	});

	onDestroy(() => {
		if (observer) {
			observer.disconnect();
		}
	});
</script>

<div class="thumbnails">
	<!-- Lazy loaded thumbnails -->
	{#if images && images.length > 0}
		{#each images as image}
			<div
				class="image"
				class:small={image.coverSize === 'small'}
				class:medium={image.coverSize === 'medium'}
				class:large={image.coverSize === 'large'}
			>
				<a href={image.articleUrl}>
					<LazyImage
						src={image.url}
						alt={image.alt}
						objectFit="contain"
						className="thumbnail-image"
					/>
				</a>
			</div>
		{/each}
	{/if}
</div>

<div class="issues__wrapper" style="--issue-color: {issueColor};">
	<div class="issue__num" class:hidden={isNavVisible} bind:this={issueNumElement}>
		<p>{issueTitle}</p>
	</div>
	<section class="articles">
		{#if gridConfig && gridConfig.length > 0}
			{@const maxRow = Math.max(...gridConfig.map((item) => item.row))}

			<!-- Process the grid data in template -->
			{@const groupedRows = (() => {
				// Pre-process articles by row
				const result: Record<number, { article: Article; gridItem: GridItem }[]> = {};

				for (let index = 0; index < Math.min(gridConfig.length, displayIssues.length); index++) {
					const gridItem = gridConfig[index];
					const article = displayIssues[index];
					const row = gridItem.row;

					if (!result[row]) result[row] = [];
					result[row].push({ article, gridItem });
				}

				return result;
			})()}

			<!-- Render each row -->
			{#each Object.entries(groupedRows) as [rowNumStr, rowArticles]}
				{@const rowNum = parseInt(rowNumStr)}
				{@const isLastRow = rowNum === maxRow}

				{#if rowArticles.length === 1}
					<!-- Handle single article in a row -->
					<div class="issue-wrapper single-last" style="grid-row: {rowNum}; grid-column: 1 / -1;">
						<ArticleCard article={rowArticles[0].article} />
					</div>
				{:else if rowArticles.length === 2}
					<!-- Handle two articles in a row -->
					<div class="issue-wrapper double-row" style="grid-row: {rowNum}; grid-column: 1 / -1;">
						<ArticleCard article={rowArticles[0].article} />
						<ArticleCard article={rowArticles[1].article} />
					</div>
				{:else}
					<!-- Standard grid layout for 3+ articles in a row -->
					{#each rowArticles as { article, gridItem }}
						<div class="issue-wrapper" style="grid-row: {rowNum}; grid-column: {gridItem.col};">
							<ArticleCard {article} />
						</div>
					{/each}
				{/if}
			{/each}
		{:else}
			<!-- Fallback to original layout logic when grid is not provided -->
			{#each displayIssues as article, index}
				{@const totalItems = displayIssues.length}
				{@const remainder = totalItems % 3}
				{@const isInLastRow = remainder > 0 && index >= totalItems - remainder}
				{@const positionInLastRow = index - (totalItems - remainder)}

				{#if remainder === 2 && isInLastRow && positionInLastRow === 0}
					<!-- Create a 2-column subgrid for the last 2 items -->
					<div class="issue-wrapper double-row">
						<ArticleCard {article} />
						<ArticleCard {article} />
					</div>
				{:else if remainder === 2 && isInLastRow && positionInLastRow === 1}
					<!-- Skip the second item as it's already included in the double-row above -->
				{:else}
					<div class="issue-wrapper" class:single-last={remainder === 1 && isInLastRow}>
						<ArticleCard {article} />
					</div>
				{/if}
			{/each}
		{/if}
	</section>
</div>

<style>
	.thumbnails {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10rem;
		padding-block: 20rem;
	}

	.thumbnails .image {
		position: -webkit-sticky;
		position: sticky;
		top: 50%;
		transform: translateY(-50%);
		max-width: 25rem; /* Default size (medium) */
		height: 70vh;
		display: grid;
		place-content: center;
	}

	.thumbnails .image.small {
		max-width: 15rem;
	}

	.thumbnails .image.medium {
		max-width: 25rem;
	}

	.thumbnails .image.large {
		max-width: 35rem;
	}
	.thumbnails .image :global(.thumbnail-image) {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
	}
	.issues__wrapper {
		width: 100%;
		color: var(--issue-color);
	}

	.issues__wrapper .issue__num {
		width: 100%;
		padding-block: calc(var(--space-16) * 4);
		text-align: center;
		transition:
			opacity 0.3s ease,
			visibility 0.3s ease;
	}

	.issues__wrapper .issue__num.hidden {
		opacity: 0;
		visibility: hidden;
	}

	.articles {
		display: grid;
		grid-template-columns: repeat(3, minmax(20rem, 1fr));
		grid-auto-rows: auto;
		gap: 1rem;
		row-gap: 2.5rem;
		place-items: center;
	}

	.issue-wrapper {
		width: 100%;
		display: flex;
		justify-content: center;
	}

	.issue-wrapper.single-last {
		grid-column: 1 / -1;
		max-width: calc(var(--content-width) * 60 / 100);
	}

	/* Two items in last row - create a 2-column subgrid spanning all columns */
	.issue-wrapper.double-row {
		grid-column: 1 / -1;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
		justify-items: center;
	}

	/* CSS for grid-based layout is handled by existing styles */

	@media (max-width: 768px) {
		.issues__wrapper .issue__num {
			font-size: var(--font-size-sm);
		}

		.articles {
			grid-template-columns: 1fr;
			width: 100%;
			justify-items: center;
			--article-width: 70%;
		}

		/* Override double-row to single column on mobile */
		.issue-wrapper.double-row {
			grid-column: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			width: var(--article-width, 90%);
		}

		/* Override grid positioning on mobile */
		.issue-wrapper {
			grid-column: 1 !important;
			grid-row: auto !important;
			width: var(--article-width, 90%);
			margin: 0 auto;
		}

		/* Reset single-last to normal width on mobile */
		.issue-wrapper.single-last {
			grid-column: 1;
			max-width: var(--article-width, 90%);
		}

		/* Add more spacing between articles on mobile */
		.articles {
			gap: 2rem;
			row-gap: 3.5rem;
		}

		/* Make thumbnails smaller on mobile */
		.thumbnails .image {
			height: 50vh;
		}

		.thumbnails .image.small {
			max-width: min(15rem, 70%);
		}

		.thumbnails .image.medium {
			max-width: min(25rem, 85%);
		}

		.thumbnails .image.large {
			max-width: min(35rem, 90%);
		}
	}
</style>
