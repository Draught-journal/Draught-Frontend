<script lang="ts">
	import { hoverImageStore } from '$lib/stores/hoverImageStore.js';
	const hoveredStack = $derived($hoverImageStore.stack ?? []);
	const activeId = $derived($hoverImageStore.active?.articleId ?? null);
	const stackLength = $derived(hoveredStack.length);
</script>

<div
	class="hover-image-container"
	class:has-images={stackLength > 0}
	aria-hidden={stackLength === 0}
>
	<div class="hover-image-stack">
		{#each hoveredStack as image, index (image.articleId)}
			<img
				src={image.src}
				alt={image.alt}
				loading="lazy"
				class={`hover-image scale-${image.scale ?? 'medium'}`}
				class:active={image.articleId === activeId}
				style={`--stack-index: ${index}; z-index: ${image.articleId === activeId ? stackLength + 1 : index + 1};`}
			/>
		{/each}
	</div>
</div>

<style>
	.hover-image-container {
		display: flex;
		position: fixed;
		left: 0;
		bottom: 0;
		width: 30vw;
		padding: 3rem;
		pointer-events: none;
		align-items: center;
		justify-content: center;
		z-index: 50000;
		opacity: 0;
		visibility: hidden;
		transition: opacity 0.3s ease;
	}

	.hover-image-container.has-images {
		opacity: 1;
		visibility: visible;
	}

	.hover-image-stack {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
	}

		.hover-image {
			position: absolute;
			bottom: 0;
			left: 0;
			overflow: hidden;
			object-fit: cover;
			transform-origin: center;
			transition:
				opacity 0.3s ease,
				transform 0.3s ease;
		}

		.hover-image.scale-small {
			width: 60%;
		}

		.hover-image.scale-medium {
			width: 80%;
		}

		.hover-image.scale-large {
			width: 100%;
		}

		.hover-image.active {
			opacity: 1;
			transform: translate(0, 0) scale(1);
		}

	@media (max-width: 900px) {
		.hover-image-container {
			display: none;
		}
	}
</style>
