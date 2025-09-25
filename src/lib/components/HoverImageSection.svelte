<script lang="ts">
	import { hoverImageStore } from '$lib/stores/hoverImageStore.js';
	const hoverImage = hoverImageStore;
</script>

<div
	class="hover-image-container"
	class:visible={$hoverImage.active}
	aria-hidden={!$hoverImage.active}
>
	{#if $hoverImage.active}
		<img
			src={$hoverImage.active.src}
			alt={$hoverImage.active.alt}
			loading="lazy"
			class="hover-image"
		/>
	{/if}
</div>

<style>
	.hover-image-container {
		display: none;
		position: fixed;
		left: 0;
		bottom: 0;
		width: 30vw;
		padding: 3rem;
		pointer-events: none;
		align-items: center;
		justify-content: center;
		z-index: 50000;
	}

	.hover-image-container.visible {
		display: flex;
	}

	.hover-image {
		display: block;
		width: 100%;
		/* height: auto; */
		/* max-height: calc(100% - clamp(12px, 2vw, 20px)); */
		object-fit: cover;
	}

	@media (max-width: 900px) {
		.hover-image-container {
			display: none;
		}
	}
</style>
