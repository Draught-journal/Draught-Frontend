<script lang="ts">
	import type { Article } from '$lib/api';
	import ContentBlurb from './ContentBlurb.svelte';
	import LazyImage from './ui/LazyImage.svelte';

	const { article }: { article: Article } = $props();

	// Check if there's a valid cover image
	const hasCoverImage = article.cover && article.cover.url;

	// Get the cover size (default to medium)
	const coverSize = article.coverSize || 'medium';

	// Image visibility and interaction states
	let showImage = $state(false);
	let ready = $state(false);
	let imageLoaded = $state(false);
	let timeoutId: ReturnType<typeof setTimeout> | null = null;

	const debounceDelay = 500;
	const hoverDelay = 200;

	function transitionToImage() {
		// Only allow transition if image has been loaded
		if (!hasCoverImage || !imageLoaded) return;

		clearTimers();
		showImage = true;
		ready = false;
		timeoutId = setTimeout(() => (ready = true), hoverDelay);
	}

	function toggleImageVisibility() {
		// Only allow toggling if image has been loaded
		if (!hasCoverImage || !ready || !imageLoaded) return;

		clearTimers();
		showImage = !showImage;

		if (showImage) {
			timeoutId = setTimeout(() => (ready = true), hoverDelay);
		} else {
			ready = false;
			timeoutId = setTimeout(() => (ready = true), debounceDelay);
		}
	}

	function clearTimers() {
		if (timeoutId) {
			clearTimeout(timeoutId);
			timeoutId = null;
		}
	}

	// Handler for when the image is loaded
	function handleImageLoad() {
		imageLoaded = true;
	}
</script>

<article class="issue" onmouseenter={hasCoverImage && imageLoaded ? transitionToImage : undefined}>
	<a href={`article/${article.slug}`}>
		<div class="content" class:hidden={showImage}>
			<div class="heading">
				<div class="tag"><p>({article.tags || ''})</p></div>
				<div class="title"><p>{article.title || 'Untitled'}</p></div>
				<div class="author"><p>{article.author || 'Anonymous'}</p></div>
			</div>

			<div class="issue__number"><p>2.1.1</p></div>

			<div class="blurb">
				<ContentBlurb content={article.content} />
			</div>
		</div>

		{#if hasCoverImage}
			<div
				class="thumbnail"
				class:visible={showImage}
				class:loaded={imageLoaded}
				class:small={coverSize === 'small'}
				class:medium={coverSize === 'medium'}
				class:large={coverSize === 'large'}
				onmouseenter={imageLoaded ? toggleImageVisibility : undefined}
				role="button"
				tabindex="0"
			>
				<LazyImage
					src={article.cover.url}
					alt={article.cover.alt || `Cover for ${article.title}`}
					objectFit="cover"
					onLoad={handleImageLoad}
				/>
			</div>
		{/if}
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
	}

	.content {
		transition:
			opacity 0.3s ease-in-out,
			transform 0.3s ease-in-out;
		width: 100%;
	}

	.content.hidden {
		opacity: 0;
		transform: translateY(-10px);
		pointer-events: none;
		transition:
			opacity 0.3s ease,
			transform 0.3s ease;
	}

	.thumbnail {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%) scale(0.95);
		opacity: 0;
		pointer-events: none;
		transition:
			opacity 0.3s ease,
			transform 0.3s ease;
		cursor: pointer;
		width: 200px;
		height: 200px;
	}

	.thumbnail.small {
		width: 150px;
		height: 150px;
	}

	.thumbnail.medium {
		width: 200px;
		height: 200px;
	}

	.thumbnail.large {
		width: 250px;
		height: 250px;
	}

	.thumbnail.visible {
		opacity: 1;
		transform: translate(-50%, -50%) scale(1);
		pointer-events: auto;
	}

	.thumbnail:not(.loaded) {
		background-color: transparent; /* No background for unloaded thumbnails */
	}

	/* Style for the LazyImage component inside thumbnail */
	.thumbnail :global(.lazy-image-container) {
		max-width: 200px;
		max-height: 200px;
	}

	.thumbnail.small :global(.lazy-image-container) {
		max-width: 150px;
		max-height: 150px;
	}

	.thumbnail.medium :global(.lazy-image-container) {
		max-width: 200px;
		max-height: 200px;
	}

	.thumbnail.large :global(.lazy-image-container) {
		max-width: 250px;
		max-height: 250px;
	}

	.issue p {
		margin: 0;
	}

	.issue .heading p {
		line-height: 23px;
	}

	.issue .issue__number {
		font-size: var(--font-size-xs);
		font-variant-numeric: oldstyle-nums;
		margin-block: 1.5rem 2.5rem;
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

		.thumbnail {
			width: 180px;
			height: 180px;
		}

		.thumbnail.small {
			width: 140px;
			height: 140px;
		}

		.thumbnail.medium {
			width: 180px;
			height: 180px;
		}

		.thumbnail.large {
			width: 220px;
			height: 220px;
		}

		.thumbnail :global(.lazy-image-container) {
			max-width: 180px;
			max-height: 180px;
		}

		.thumbnail.small :global(.lazy-image-container) {
			max-width: 140px;
			max-height: 140px;
		}

		.thumbnail.medium :global(.lazy-image-container) {
			max-width: 180px;
			max-height: 180px;
		}

		.thumbnail.large :global(.lazy-image-container) {
			max-width: 220px;
			max-height: 220px;
		}

		.issue .heading .title p {
			font-size: var(--font-size-md, 1.2rem);
		}

		.blurb {
			font-size: var(--font-size-xs, 0.8rem);
		}
	}
</style>
