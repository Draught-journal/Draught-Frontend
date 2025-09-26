<script lang="ts">
	import type { Article } from '$lib/api';
	import { hoverImageStore } from '$lib/stores/hoverImageStore.js';
	import ContentBlurb from './ContentBlurb.svelte';

	const { article }: { article: Article } = $props();

	let cardElement: HTMLElement | null = null;

	function handlePointerEnter() {
		hoverImageStore.setFromPointer(article);
	}

	function handlePointerLeave() {
		hoverImageStore.clear(article.id, { source: 'pointer' });
	}
</script>

<article class="issue" bind:this={cardElement}>
	<a
		href={`article/${article.slug}`}
		onfocusin={handlePointerEnter}
		onfocusout={handlePointerLeave}
		onmouseenter={handlePointerEnter}
		onmouseleave={handlePointerLeave}
	>
		<div class="content">
			<div class="heading">
				<div class="title">
					<p>
						<span class="tag">({article.tags || ''})</span> <br />
						<span class="title">{article.title || 'Untitled'}</span> <br />
						<span class="author">{article.author || ''}</span>
					</p>
				</div>
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

	.issue:hover .heading .title p span.tag {
		font-family: 'OTParellel-cursive', 'OTParellel', serif;
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
		line-height: 22px;
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
		}
	}
</style>
