<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import ArticleCard from './ArticleCard.svelte';
	import { navStore } from '$lib/stores/navStore.js';
	import type { Article } from '$lib/api';

	let {
		issueColor = '#000000',
		articles = []
	}: {
		issueColor?: string;
		articles?: Article[];
	} = $props();

	// For demo purposes, create 8 issues if none provided
	const displayIssues = $derived(articles.length > 0 ? articles : (Array(8).fill({}) as Article[]));

	let issueNumElement: HTMLDivElement;
	let observer: IntersectionObserver;
	const images = $derived(
		articles
			.filter((article) => article.cover && article.cover.url)
			.map((article) => ({
				url: article.cover.url,
				alt: article.cover.alt || `Cover image for ${article.title}`,
				articleUrl: article.slug ? `/article/${article.slug}` : '#'
			}))
	);

	onMount(() => {
		if (issueNumElement) {
			observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.target === issueNumElement) {
							const issueText = entry.target.textContent?.trim() || '';
							navStore.update((store) => ({
								...store,
								issueText,
								showNav: !entry.isIntersecting,
								showIssue: !entry.isIntersecting
							}));
						}
					});
				},
				{
					// Trigger when the element is completely out of view
					threshold: 0,
					rootMargin: '-310px 0px 0px 0px' // Account for nav height
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
	<!-- 5 random image -->
	{#if images && images.length > 0}
		{#each images as image}
			<div class="image">
				<a href={image.articleUrl}>
					<img src={image.url} alt={image.alt} />
				</a>
			</div>
		{/each}
	{/if}
</div>

<div class="issues__wrapper" style="--issue-color: {issueColor};">
	<div class="issue__num" bind:this={issueNumElement}>
		<p>issue one</p>
	</div>
	<section class="articles">
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
	</section>
</div>

<style>
	.thumbnails {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10rem;
	}

	.thumbnails .image {
		position: -webkit-sticky;
		position: sticky;
		top: 50%;
		transform: translateY(-50%);
		max-width: 25rem;
	}
	.thumbnails .image img {
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
	}

	.articles {
		display: grid;
		grid-template-columns: repeat(3, minmax(20rem, 1fr));
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

	@media (max-width: 768px) {
		.issues__wrapper .issue__num {
			font-size: var(--font-size-sm);
		}

		.articles {
			grid-template-columns: 1fr;
		}

		/* Override double-row to single column on mobile */
		.issue-wrapper.double-row {
			grid-column: 1;
			display: block;
		}

		/* Reset single-last to normal width on mobile */
		.issue-wrapper.single-last {
			grid-column: 1;
			max-width: none;
		}
	}
</style>
