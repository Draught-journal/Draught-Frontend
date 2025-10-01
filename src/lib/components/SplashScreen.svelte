<script lang="ts">
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { useNavigation } from '$lib/components/navigation/composables/useNavigation.js';
	import { navStore } from '$lib/stores/navStore.js';
	import { hoverImageStore } from '$lib/stores/hoverImageStore.js';

	const {
		sentences,
		controlsNav = false,
		isFooter = false
	}: {
		sentences?: string[];
		controlsNav?: boolean;
		isFooter?: boolean;
	} = $props();

	let selectedSentence = $state('');
	let splashElement: HTMLElement | null = $state(null);
	const navigation = useNavigation();

	function handleHeadClick() {
		const navState = get(navStore);
		if (!navState.activeViews.home) {
			navigation.toggleHome();
		}
	}

	// Function to get a random sentence and cycle through them
	function getRandomSentence(sentences: string[]): string {
		if (!sentences || sentences.length === 0) return '';

		const STORAGE_KEY = 'draught-displayed-sentences';

		try {
			// Get previously displayed sentences from localStorage
			const storedData = localStorage.getItem(STORAGE_KEY);
			const displayedSentences: string[] = storedData ? JSON.parse(storedData) : [];

			// Get sentences that haven't been displayed yet
			const remainingSentences = sentences.filter(
				(sentence) => !displayedSentences.includes(sentence)
			);

			let chosenSentence: string;

			if (remainingSentences.length === 0) {
				// All sentences have been displayed, restart the cycle
				chosenSentence = sentences[Math.floor(Math.random() * sentences.length)];
				localStorage.setItem(STORAGE_KEY, JSON.stringify([chosenSentence]));
			} else {
				// Pick a random sentence from remaining ones
				chosenSentence = remainingSentences[Math.floor(Math.random() * remainingSentences.length)];
				displayedSentences.push(chosenSentence);
				localStorage.setItem(STORAGE_KEY, JSON.stringify(displayedSentences));
			}

			return chosenSentence;
		} catch (error) {
			console.warn('Failed to access localStorage, falling back to random selection:', error);
			return sentences[Math.floor(Math.random() * sentences.length)];
		}
	}

	onMount(() => {
		if (sentences && sentences.length > 0) {
			selectedSentence = getRandomSentence(sentences);
		}

		// Set up Intersection Observer only if this splash screen should control nav visibility
		if (controlsNav && splashElement) {
			// Create a unique ID for this splash screen instance
			const splashId = `splash-${Math.random().toString(36).substr(2, 9)}`;

			const observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						navStore.update((store) => {
							// Get current list of visible splash screens
							const visibleSplashes = store.visibleSplashes || new Set();

							if (entry.isIntersecting) {
								// Add this splash to visible list
								visibleSplashes.add(splashId);
							} else {
								// Remove this splash from visible list
								visibleSplashes.delete(splashId);
							}

							// Hide nav if any splash screens are visible
							return {
								...store,
								visibleSplashes,
								showNav: visibleSplashes.size === 0 ? false : false // Keep nav hidden when any splash is visible
							};
						});
					});
				},
				{
					// Trigger when 50% of the splash screen is visible
					threshold: 0.5,
					// Add some margin to make the transition smoother
					rootMargin: '-10% 0px -10% 0px'
				}
			);

			// Observer for hover image reset (100% threshold)
			const hoverImageObserver = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
							// Reset hover images when splash is 50% in view
							hoverImageStore.reset();
							console.log('Hover images reset on splash 100% visibility');
						}
					});
				},
				{
					// Trigger when 50% of the splash screen is visible
					threshold: 0.5,
					// No margin for precise 100% detection
					rootMargin: '0px'
				}
			);

			observer.observe(splashElement);
			hoverImageObserver.observe(splashElement);

			// Cleanup observer on component destroy
			return () => {
				observer.disconnect();
				hoverImageObserver.disconnect();
				// Remove this splash from the visible list when component unmounts
				navStore.update((store) => {
					const visibleSplashes = store.visibleSplashes || new Set();
					visibleSplashes.delete(splashId);
					return {
						...store,
						visibleSplashes,
						showNav: visibleSplashes.size === 0
					};
				});
			};
		}
	});
</script>

{#if !isFooter}
	<div class="splash" bind:this={splashElement}>
		<button class="head" onclick={handleHeadClick}>
			<p class="title">draught <br /><span class="sentence">({selectedSentence})</span></p>
		</button>
	</div>
{:else}
	<!-- Sentences show if Is Footer -->
	<div class="splash" bind:this={splashElement}>
		<div class="sentences">
			{#if sentences && sentences.length > 0}
				{#each sentences as sentence}
					<p>({sentence})</p>
				{/each}
			{/if}
		</div>
	</div>
{/if}

<style>
	.splash {
		display: grid;
		place-content: center;
		height: 100vh;
		margin-bottom: 20vh;
	}

	.splash:has(.sentences) {
		align-content: end;
		padding-block-end: var(--space-8);
	}

	.sentences {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		max-width: var(--content-width);
		width: 100%;
		column-gap: var(--space-4);
	}

	.splash button.head {
		all: unset;
		text-align: center;
		font-size: var(--font-size-lg);
		line-height: 26px;
		cursor: pointer;
	}
	.head .title {
		font-family: 'OTParellel-cursive', 'OTParellel', serif;
		font-style: italic;
		font-weight: 400;
		font-synthesis: none; /* don't fake italic/bold */
	}
	.splash .head .sentence {
		font-family: 'OTParellel', serif;
		font-style: normal;
	}
</style>
