<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { Article } from '$lib/api';
	import { hoverImageStore } from '$lib/stores/hoverImageStore.js';
	import ContentBlurb from './ContentBlurb.svelte';

	const { article }: { article: Article } = $props();

	let cardElement: HTMLElement | null = null;
	let observer: IntersectionObserver | null = null;

	function handlePointerEnter() {
		hoverImageStore.setFromPointer(article);
	}

	function handlePointerLeave() {
		hoverImageStore.clear(article.id, { source: 'pointer' });
	}

	onMount(() => {
		if (typeof window === 'undefined' || !cardElement) {
			return;
		}

		observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					const ratio = entry.intersectionRatio;

					if (ratio > 0) {
						hoverImageStore.setFromViewport(article, ratio);
					} else {
						hoverImageStore.clear(article.id, { source: 'viewport' });
					}
				}
			},
			{
				threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
				rootMargin: '0px 0px -20% 0px'
			}
		);

		observer.observe(cardElement);

		return () => {
			observer?.disconnect();
		};
	});

	onDestroy(() => {
		observer?.disconnect();
		hoverImageStore.clear(article.id);
	});
</script>

<article class="issue" bind:this={cardElement}>
	<a
		href={`article/${article.slug}`}
		on:focusin={handlePointerEnter}
		on:focusout={handlePointerLeave}
		on:mouseenter={handlePointerEnter}
		on:mouseleave={handlePointerLeave}
	>
		<div class="content">
			<div class="heading">
				<div class="tag"><p>({article.tags || ''})</p></div>
				<div class="title"><p>{article.title || 'Untitled'}</p></div>
				<div class="author"><p>{article.author || ''}</p></div>
			</div>

			<div class="issue__number"><p>2.1.1</p></div>

			<div class="blurb">
				<ContentBlurb content={article.content} />
			</div>
		</div>
	</a>
</article>

<style>
	.issue {
		display: flex;
		flex-direction: column;
		padding: 16px;
		align-items: center;
		text-align: center;
		position: relative;
		min-height: 300px; /* Ensure consistent height */
		max-width: 30vw;
		width: 100%;
		font-variant-numeric: oldstyle-nums;
	}

	.issue:hover .heading {
		font-style: italic;
		font-synthesis: none;
	}

	.content {
		transition:
			opacity 0.3s ease-in-out,
			transform 0.3s ease-in-out;
		width: 100%;
	}

	.issue p {
		margin: 0;
	}

	.issue .heading p {
		line-height: 23px;
	}

	.issue .issue__number {
		font-size: var(--font-size-base);
		font-variant-numeric: oldstyle-nums;
		margin-block: 1.2rem 1.5rem;
	}

	.blurb {
		margin-top: 8px;
		text-align: left;
		font-size: var(--font-size-sm);
		line-height: 19px;
		hyphens: auto;
	}

	@media (max-width: 768px) {
		.issue {
			max-width: 100%;
			width: 100%;
			padding: 12px;
		}

		.issue .heading .title p {
			font-size: var(--font-size-md, 1.2rem);
		}

		.blurb {
			font-size: var(--font-size-xs, 0.8rem);
		}
	}
</style>
