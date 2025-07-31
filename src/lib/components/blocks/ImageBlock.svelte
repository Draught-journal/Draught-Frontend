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
		margin-bottom: 2rem;
	}

	.image-container {
		position: relative;
		overflow: hidden;
		border-radius: 8px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.block-image {
		width: 100%;
		height: 100%;
		display: block;
		transition: transform 0.3s ease;
	}

	.block-image:hover {
		transform: scale(1.02);
	}

	.image-caption {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
		color: white;
		padding: 1rem;
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

	.image-link:hover {
		text-decoration: underline;
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
