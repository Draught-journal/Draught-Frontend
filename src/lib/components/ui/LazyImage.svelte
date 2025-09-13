<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	
	/**
	 * A reusable component for lazy loading images
	 */
	
	// Props
	const {
		src = '',
		alt = '',
		className = '',
		style = '',
		width,
		height,
		objectFit = 'cover',
		placeholderColor = 'transparent',
		rootMargin = '200px 0px', // Load images 200px before they enter viewport
		threshold = 0.01,
		useSrcset = false, // Whether to use srcset for responsive images
		sizes = '',
		srcset = '',
		onLoad = () => {}  // Callback function when image loads
	} = $props<{
		src: string;
		alt: string;
		className?: string;
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
		onLoad?: () => void;
	}>();
	
	// State
	let containerElement = $state<HTMLDivElement | null>(null);
	let imageLoaded = $state(false);
	let shouldLoad = $state(typeof window === 'undefined'); // Load immediately on SSR
	let observer: IntersectionObserver | null = null;
	
	// Initialize Intersection Observer on mount
	onMount(() => {
		if (!containerElement || typeof window === 'undefined' || shouldLoad) return;
		
		observer = new IntersectionObserver(
			(entries) => {
				const [entry] = entries;
				if (entry.isIntersecting) {
					shouldLoad = true;
					observer?.disconnect();
				}
			},
			{ rootMargin, threshold }
		);
		
		observer.observe(containerElement);
		
		return () => {
			observer?.disconnect();
		};
	});
	
	// Clean up observer on destroy
	onDestroy(() => {
		observer?.disconnect();
	});
	
	// Handle image load event
	const handleImageLoad = () => {
		imageLoaded = true;
		onLoad();
	};
	
	// Combine class names
	const imageClasses = $derived(
		`lazy-image ${imageLoaded ? 'loaded' : ''} ${className}`.trim()
	);
</script>

<div 
	class="lazy-image-container" 
	bind:this={containerElement}
	style="--placeholder-color: {placeholderColor}; {style}"
>
	{#if shouldLoad}
		<img
			{src}
			{alt}
			class={imageClasses}
			style="object-fit: {objectFit};"
			loading="lazy"
			decoding="async"
			onload={handleImageLoad}
			width={width}
			height={height}
			srcset={useSrcset ? srcset : undefined}
			sizes={useSrcset ? sizes : undefined}
		/>
	{:else}
		<!-- Empty placeholder to maintain space -->
		<div 
			class="placeholder" 
			style="width: {width}; height: {height};"
			aria-hidden="true"
		></div>
	{/if}
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
		width: 100%;
		height: 100%;
		opacity: 0;
		transition: opacity 0.3s ease;
		position: relative;
		z-index: 2;
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
		background-color: var(--placeholder-color, transparent);
		z-index: 1;
	}
</style>