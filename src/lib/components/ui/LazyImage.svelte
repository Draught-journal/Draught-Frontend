<script lang="ts">
	import { onMount } from 'svelte';

	type IntersectionCallback = (entry: IntersectionObserverEntry) => void;

	interface Props {
		src: string;
		alt: string;
		class?: string;
		style?: string;
		width?: number | string;
		height?: number | string;
		objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
		placeholderColor?: string;
		rootMargin?: string;
		threshold?: number;
		useSrcset?: boolean;
		sizes?: string;
		srcset?: string;
		fetchPriority?: 'auto' | 'high' | 'low';
		decoding?: 'async' | 'auto' | 'sync';
		nativeLazy?: boolean;
		onLoad?: () => void;
	}

	let {
		src = '',
		alt = '',
		class: className = '',
		style = '',
		width = $bindable(),
		height = $bindable(),
		objectFit = 'cover',
		placeholderColor = '#efefef',
		rootMargin = '200px 0px',
		threshold = 0.01,
		useSrcset = false,
		sizes = '',
		srcset = '',
		fetchPriority = 'auto',
		decoding = 'async',
		nativeLazy = false,
		onLoad = () => {}
	}: Props = $props();

	// Share observers across instances so we only create them when their options differ.
	const hasWindow = typeof window !== 'undefined';
	const observerRegistry = new Map<
		string,
		{ observer: IntersectionObserver; targets: Map<Element, IntersectionCallback> }
	>();
	const loadedSources = new Set<string>();

	const createObserverKey = (options: IntersectionObserverInit) => {
		const { root, rootMargin: rm, threshold: t } = options;
		const thresholdArray = Array.isArray(t) ? t : [t ?? 0];
		return `${root ? 'rooted' : 'root:null'}|${rm ?? '0px'}|${thresholdArray.join(',')}`;
	};

	const observeElement = (
		element: Element,
		options: IntersectionObserverInit,
		callback: IntersectionCallback
	) => {
		const key = createObserverKey(options);
		let entry = observerRegistry.get(key);

		if (!entry) {
			const targets = new Map<Element, IntersectionCallback>();
			const observer = new IntersectionObserver((entries) => {
				for (const entry of entries) {
					const cb = targets.get(entry.target);
					if (cb) cb(entry);
				}
			}, options);

			entry = { observer, targets };
			observerRegistry.set(key, entry);
		}

		entry.targets.set(element, callback);
		entry.observer.observe(element);

		return () => {
			entry?.targets.delete(element);
			entry?.observer.unobserve(element);

			if (entry && entry.targets.size === 0) {
				entry.observer.disconnect();
				observerRegistry.delete(key);
			}
		};
	};

	const normaliseDimension = (dimension?: number | string) => {
		if (typeof dimension === 'number') return `${dimension}px`;
		return dimension?.toString().trim() || '';
	};

	const buildDimensionStyle = (
		dimensionWidth?: number | string,
		dimensionHeight?: number | string
	) => {
		const widthValue = normaliseDimension(dimensionWidth);
		const heightValue = normaliseDimension(dimensionHeight);

		return [widthValue && `width: ${widthValue};`, heightValue && `height: ${heightValue};`]
			.filter(Boolean)
			.join(' ');
	};

	const buildContainerStyle = (color: string, inlineStyle?: string, dimensionStyle?: string) => {
		const pieces = [`--placeholder-color: ${color};`];

		if (dimensionStyle?.length) {
			pieces.push(dimensionStyle);
		}

		if (inlineStyle?.trim()) {
			pieces.push(inlineStyle.trim());
		}

		return pieces.join(' ');
	};

	const getSourceKey = (baseSrc: string, srcset?: string) => {
		const trimmedSrc = baseSrc?.trim() || '';
		const trimmedSrcset = srcset?.trim();
		return trimmedSrcset ? `${trimmedSrc}|${trimmedSrcset}` : trimmedSrc;
	};

	const effectiveSrcset = $derived(useSrcset ? srcset : '');
	const sourceKey = $derived(getSourceKey(src, effectiveSrcset));
	const dimensionStyle = $derived(buildDimensionStyle(width, height));
	const containerStyle = $derived(buildContainerStyle(placeholderColor, style, dimensionStyle));
	const placeholderStyle = $derived(dimensionStyle);
	const loadingMode = $derived(nativeLazy ? 'lazy' : 'eager');

	let containerElement = $state<HTMLDivElement | null>(null);
	let unobserve: (() => void) | null = $state(null);
	let shouldLoad = $state(false);
	let imageLoaded = $state(false);

	// Initialize load states based on sourceKey
	$effect(() => {
		if (!hasWindow) {
			shouldLoad = true;
			imageLoaded = true;
			return;
		}

		if (sourceKey && loadedSources.has(sourceKey)) {
			shouldLoad = true;
			imageLoaded = true;
		}
	});

	$effect(() => {
		if (shouldLoad && unobserve) {
			unobserve();
			unobserve = null;
		}
	});

	onMount(() => {
		if (!hasWindow) return;

		if (!containerElement || shouldLoad) return;

		if (!('IntersectionObserver' in window)) {
			shouldLoad = true;
			return;
		}

		unobserve = observeElement(containerElement, { rootMargin, threshold }, (entry) => {
			if (entry.isIntersecting) {
				shouldLoad = true;
			}
		});

		return () => {
			if (unobserve) {
				unobserve();
				unobserve = null;
			}
		};
	});

	const handleImageLoad = () => {
		if (sourceKey) {
			loadedSources.add(sourceKey);
		}

		imageLoaded = true;
		onLoad();
	};

	const imageClasses = $derived(`lazy-image ${imageLoaded ? 'loaded' : ''} ${className}`.trim());
</script>

<div class="lazy-image-container" bind:this={containerElement} style={containerStyle}>
	{#if shouldLoad}
		<img
			{src}
			{alt}
			class={imageClasses}
			style="object-fit: {objectFit};"
			loading={loadingMode}
			{decoding}
			fetchpriority={fetchPriority}
			onload={handleImageLoad}
			{width}
			{height}
			srcset={effectiveSrcset || undefined}
			sizes={effectiveSrcset ? sizes : undefined}
		/>
	{/if}

	<div
		class="placeholder"
		class:placeholder--visible={!imageLoaded}
		style={placeholderStyle}
		aria-hidden="true"
	></div>
</div>

<style>
	.lazy-image-container {
		position: relative;
		overflow: hidden;
		display: block;
		width: 100%;
		height: 100%;
	}

	.lazy-image {
		width: inherit;
		height: inherit;
		opacity: 0;
		transition: opacity 0.3s ease;
		position: relative;
		z-index: 2;
		display: block;
	}

	.lazy-image.loaded {
		opacity: 1;
	}

	.placeholder {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: var(--placeholder-color, #efefef);
		z-index: 1;
		opacity: 0;
		transition: opacity 0.35s ease;
		background-image: linear-gradient(
			90deg,
			var(--placeholder-color, #efefef) 25%,
			rgba(255, 255, 255, 0.35) 45%,
			var(--placeholder-color, #efefef) 65%
		);
		background-size: 200% 100%;
		animation: placeholder-shimmer 1.2s ease-in-out infinite;
		pointer-events: none;
	}

	.placeholder--visible {
		opacity: 1;
	}

	@keyframes placeholder-shimmer {
		from {
			background-position: 0% 50%;
		}
		to {
			background-position: -200% 50%;
		}
	}
</style>
