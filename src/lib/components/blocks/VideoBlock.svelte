<script lang="ts">
	import type { VideoContentBlock } from '$lib/api/schemas/draughtSchema';

	const { content } = $props<{ content: VideoContentBlock }>();

	const scale = $derived(content.content.video?.scale || content.content.scale || 'medium');
	const videoClass = $derived(`block-video scale-${scale}`);

	const videoSrc = $derived(
		content.content.video?.url || content.content.url || content.content.src || ''
	);
	const posterSrc = $derived(content.content.poster?.url || '');
	const caption = $derived(content.content.video?.caption || content.content.caption || '');

	const controls = $derived(content.content.controls ?? true);
	const autoplay = $derived(content.content.autoplay ?? false);
	const loop = $derived(content.content.loop ?? false);
	const muted = $derived(content.content.muted ?? autoplay);
	const playsinline = $derived(content.content.playsinline ?? true);
</script>

{#if videoSrc}
	<div
		class={`video-block ${scale === 'large' ? 'full-width-container' : ''}`}
		data-block-id={content.id}
	>
		<figure class="video-container">
			<video
				class={videoClass}
				src={videoSrc}
				poster={posterSrc || undefined}
				{controls}
				{autoplay}
				{loop}
				{muted}
				{playsinline}
				preload="metadata"
				style:aspect-ratio={content.content.ratio || undefined}
			>
				<track kind="captions" />
			</video>

			{#if caption}
				<figcaption class={`video-caption scale-${scale}`}>
					{@html caption}
				</figcaption>
			{/if}
		</figure>
		{#if content.content.link}
			<a href={content.content.link} class="video-link"> View video </a>
		{/if}
	</div>
{/if}

<style>
	:global(html) {
		overflow-x: hidden;
		max-width: 100%;
	}

	.video-block {
		margin-block-start: 2rem;
		margin-block-end: 0.8rem;
		overflow-x: hidden;
		position: relative;
	}

	.full-width-container {
		position: relative;
		width: calc((var(--content-width, 1200px) * 0.5) + 5rem);
		left: 50%;
		transform: translateX(-50%);
		box-sizing: border-box;
		overflow-x: hidden;
	}

	.video-container {
		position: relative;
	}

	.block-video {
		display: block;
		width: 100%;
		height: auto;
		margin: 0 auto;
		background: #000;
	}

	.block-video.scale-small {
		width: 60%;
	}

	.block-video.scale-medium {
		width: 80%;
	}

	.block-video.scale-large {
		width: 100%;
		max-width: 100%;
	}

	.video-caption {
		margin: 0 auto;
		padding-block: 0.5rem;
		font-size: var(--font-size-sm);
		text-align: center;
		font-variant-numeric: oldstyle-nums;
		line-height: 1.2;
	}

	.video-caption.scale-small {
		width: 90%;
	}

	.video-caption.scale-medium {
		width: 80%;
	}

	.video-caption.scale-large {
		width: 100%;
		max-width: 100%;
		padding-inline: 1rem;
		box-sizing: border-box;
	}

	.video-link {
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

	@media (max-width: 768px) {
		.video-block {
			margin-bottom: 1.5rem;
		}

		.full-width-container {
			width: 100%;
			left: 0;
			transform: none;
		}

		.block-video.scale-small,
		.block-video.scale-medium,
		.block-video.scale-large,
		.video-caption.scale-small,
		.video-caption.scale-medium,
		.video-caption.scale-large {
			width: 100%;
		}
	}
</style>
