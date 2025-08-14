<script lang="ts">
	import type { ImageContentBlock } from '$lib/api/schemas/draughtSchema';

	const { content }: { content: ImageContentBlock } = $props();
</script>

<div class="image-block" data-block-id={content.id}>
	<figure class="image-container" style="aspect-ratio: {content.content.ratio || 'auto'}">
		<img
			src={content.content.image[0].url}
			alt={content.content.alt}
			class="block-image"
			style="object-fit: {content.content.crop || 'cover'}"
		/>
		{#if content.content.caption}
			<figcaption class="image-caption">
				{content.content.caption}
			</figcaption>
		{/if}
	</figure>
	{#if content.content.link}
		<a href={content.content.link} class="image-link"> View full size </a>
	{/if}
</div>

<style>
	.image-block {
		margin-block: 2rem;
	}

	.image-container {
		position: relative;
		overflow: hidden;
	}

	.block-image {
		width: 80%;
		height: 100%;
		display: block;
		margin: 0 auto;
		transition: transform 0.3s ease;
	}

	.image-caption {
		width: 80%;
		margin: 0 auto;
		padding-block: 0.5rem;
		font-size: 0.9rem;
		font-style: italic;
	}

	.image-link {
		display: inline-block;
		margin-top: 0.5rem;
		color: var(--accent-color, #0066cc);
		text-decoration: none;
		font-size: 0.9rem;
		transition: color 0.3s ease;
	}

	/* Responsive adjustments */
	@media (max-width: 768px) {
		.image-block {
			margin-bottom: 1.5rem;
		}

		.image-caption {
			font-size: 0.8rem;
			padding: 0.75rem;
		}
	}
</style>
