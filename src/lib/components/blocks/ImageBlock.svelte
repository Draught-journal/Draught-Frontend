<script lang="ts">
	import type { ImageContentBlock } from '$lib/api/schemas/draughtSchema';
	import LazyImage from '../ui/LazyImage.svelte';

	// Use the proper Svelte runes syntax
	const { content } = $props<{ content: ImageContentBlock }>();

	// Handle scale property (small, medium, large, or null which defaults to medium)
	const scale = $derived(content.content.image.scale || 'medium');
	const imageClass = $derived(`block-image scale-${scale}`);

	// Get appropriate sizes based on scale
	const getSizes = () => {
		switch (scale) {
			case 'small':
				return '(max-width: 768px) 80vw, 60vw';
			case 'medium':
				return '(max-width: 768px) 100vw, 80vw';
			case 'large':
				return '100vw';
			default:
				return '(max-width: 768px) 100vw, 80vw';
		}
	};

	// Generate srcset if URL contains width and height parameters
	const generateSrcset = (url: string) => {
		// Check if we can parse the URL and if it seems to be from an image service
		// that supports width parameters (e.g., /images/image.jpg?w=800&h=600)
		if (!url || !url.includes('?')) return '';

		try {
			const baseUrl = url.split('?')[0];
			const widths = [480, 768, 1024, 1440, 1920];

			return widths.map((w) => `${baseUrl}?w=${w} ${w}w`).join(', ');
		} catch (e) {
			return '';
		}
	};

	// Generate proper srcset if possible
	const srcset = $derived(generateSrcset(content.content.image.url));
	const sizes = $derived(getSizes());
</script>

<div
	class={`image-block ${scale === 'large' ? 'full-width-container' : ''}`}
	data-block-id={content.id}
>
	<figure
		class="image-container {imageClass}"
		style="aspect-ratio: {content.content.ratio || 'auto'}"
	>
		<LazyImage
			src={content.content.image.url}
			alt={content.content.image.alt}
			{srcset}
			{sizes}
			objectFit={content.content.crop || 'cover'}
			className={imageClass}
		/>

		{#if content.content.image.caption}
			<figcaption class={`image-caption scale-${scale}`}>
				{@html content.content.image.caption}
			</figcaption>
		{/if}
	</figure>
	{#if content.content.link}
		<a href={content.content.link} class="image-link"> View full size </a>
	{/if}
</div>

<style>
	:global(html) {
		overflow-x: hidden; /* Prevent horizontal scrolling at the root level */
		max-width: 100%;
	}

	.image-block {
		margin-block-start: 2rem;
		margin-block-end: 0.8rem;
		overflow-x: hidden; /* Prevent horizontal scrolling */
		position: relative; /* Establish containing block */
	}

	.full-width-container {
		position: relative;
		width: calc((var(--content-width, 1200px) * 0.5) + 5rem);
		left: 50%;
		transform: translateX(-50%);
		box-sizing: border-box;
		overflow-x: hidden;
	}

	.image-container {
		position: relative;
		overflow: hidden;
	}

	/* Removed placeholder styling since we don't need it without background */

	.block-image {
		height: 100%;
		display: block;
		margin: 0 auto;
		transition: transform 0.3s ease;
		z-index: 2;
		position: relative;
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
		font-variant-numeric: oldstyle-nums;
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
