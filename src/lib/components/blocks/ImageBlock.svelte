<script lang="ts">
	import type { ImageContentBlock } from '$lib/api/schemas/draughtSchema';

	// Use the proper Svelte runes syntax
	const { content } = $props<{ content: ImageContentBlock }>();

	// Handle scale property (small, medium, large, or null which defaults to medium)
	const scale = $derived(content.content.image.scale || 'medium');
	const imageClass = $derived(`block-image scale-${scale}`);
</script>

<div
	class={`image-block ${scale === 'large' ? 'full-width-container' : ''}`}
	data-block-id={content.id}
>
	<figure class="image-container" style="aspect-ratio: {content.content.ratio || 'auto'}">
		<img
			src={content.content.image.url}
			alt={content.content.image.alt}
			class={imageClass}
			style="object-fit: {content.content.crop || 'cover'}"
		/>
		{#if content.content.image.caption}
			<figcaption class={`image-caption scale-${scale}`}>
				{content.content.image.caption}
			</figcaption>
		{/if}
	</figure>
	{#if content.content.link}
		<a href={content.content.link} class="image-link"> View full size </a>
	{/if}
</div>

<style>
	:global(html, body) {
		overflow-x: hidden; /* Prevent horizontal scrolling at the root level */
		max-width: 100%;
	}

	.image-block {
		margin-block: 2rem;
		overflow-x: hidden; /* Prevent horizontal scrolling */
		position: relative; /* Establish containing block */
	}

	.full-width-container {
		position: relative;
		width: 100vw;
		left: 50%;
		transform: translateX(-50%);
		box-sizing: border-box;
		overflow-x: hidden;
	}

	.image-container {
		position: relative;
		overflow: hidden;
	}

	.block-image {
		height: 100%;
		display: block;
		margin: 0 auto;
		transition: transform 0.3s ease;
	}

	/* Scale variations */
	.block-image.scale-small {
		width: 60%;
	}

	.block-image.scale-medium {
		width: 80%;
	}

	.block-image.scale-large {
		width: 100%;
		max-width: 100%;
		margin: 0 auto;
	}

	.image-caption {
		margin: 0 auto;
		padding-block: 0.5rem;
		font-size: var(--font-size-sm);
		text-align: center;
	}

	.image-caption.scale-small {
		width: 60%;
	}

	.image-caption.scale-medium {
		width: 80%;
	}

	.image-caption.scale-large {
		width: 100%;
		max-width: 100%;
		padding-inline: 1rem;
		box-sizing: border-box;
	}

	.image-link {
		display: inline-block;
		margin-top: 0.5rem;
		margin-left: auto;
		margin-right: auto;
		text-align: center;
		width: 100%;
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

		.block-image.scale-small {
			width: 80%;
		}

		.block-image.scale-medium,
		.block-image.scale-large {
			width: 100%;
		}

		.image-caption {
			font-size: 0.8rem;
			padding: 0.75rem;
		}

		.image-caption.scale-small {
			width: 80%;
		}

		.image-caption.scale-medium,
		.image-caption.scale-large {
			width: 100%;
		}
	}
</style>
