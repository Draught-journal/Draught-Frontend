<script lang="ts">
	import type { VideoContentBlock } from '$lib/api/schemas/draughtSchema';

	const { content } = $props<{ content: VideoContentBlock }>();

	type VideoField = string | { url?: string | null } | Array<string | { url?: string | null }>;

	const getMediaUrl = (field: VideoField | undefined, fallback = '') => {
		if (!field) return fallback;

		const value = Array.isArray(field) ? field[0] : field;
		const url = typeof value === 'string' ? value : value?.url || '';

		// `file://...` is a Kirby file reference, not a browser-loadable asset URL.
		return url.startsWith('file://') ? '' : url;
	};

	const toBoolean = (value: boolean | string | undefined, fallback: boolean) => {
		if (typeof value === 'boolean') return value;
		if (typeof value === 'string') return value.toLowerCase() === 'true';
		return fallback;
	};

	const scale = $derived(content.content.scale || 'medium');
	const videoClass = $derived(`block-video scale-${scale}`);

	const videoSrc = $derived(
		getMediaUrl(content.content.video, content.content.url || content.content.src || '')
	);
	const posterSrc = $derived(getMediaUrl(content.content.poster));
	const caption = $derived(content.content.caption || '');

	const controls = $derived(toBoolean(content.content.controls, true));
	const autoplay = $derived(toBoolean(content.content.autoplay, false));
	const loop = $derived(toBoolean(content.content.loop, false));
	const muted = $derived(toBoolean(content.content.muted, autoplay));
	const playsinline = $derived(toBoolean(content.content.playsinline, true));
	const preload = $derived(content.content.preload || 'metadata');
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
				{preload}
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
{:else}
	<div
		class={`video-block ${scale === 'large' ? 'full-width-container' : ''}`}
		data-block-id={content.id}
	>
		<p class="video-unavailable">Video source is unavailable.</p>
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

	.video-unavailable {
		width: min(100%, 80%);
		margin: 0 auto;
		padding: 1rem;
		text-align: center;
		border: 1px solid currentColor;
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
