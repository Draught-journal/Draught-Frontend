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

		if (!controlsNav || !splashElement) {
			return;
		}

		const splashId = `splash-${Math.random().toString(36).substr(2, 9)}`;
		// Single observer handles nav visibility and hover image resets
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					const isVisible = entry.isIntersecting;
					const isHalfVisible = isVisible && entry.intersectionRatio >= 0.5;

					navStore.update((store) => {
						const visibleSplashes = new Set(store.visibleSplashes || []);

						if (isVisible) {
							visibleSplashes.add(splashId);
						} else {
							visibleSplashes.delete(splashId);
						}

						return {
							...store,
							visibleSplashes,
							showNav: false
						};
					});

					if (isHalfVisible) {
						hoverImageStore.reset();
					}
				});
			},
			{
				threshold: [0, 0.5],
				rootMargin: '-10% 0px -10% 0px'
			}
		);

		observer.observe(splashElement);

		return () => {
			observer.disconnect();
			navStore.update((store) => {
				const visibleSplashes = new Set(store.visibleSplashes || []);
				visibleSplashes.delete(splashId);
				return {
					...store,
					visibleSplashes,
					showNav: visibleSplashes.size === 0
				};
			});
		};
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
		<button class="sentence" onclick={handleHeadClick}>
			<p>
				<span class="title">draught</span> is made at the School of the Arts and Humanities at the
				Royal College of Art, London.
			</p>
		</button>
	</div>
{/if}

<style>
	.splash {
		display: grid;
		place-content: center;
		height: 100vh;
		margin-bottom: 20vh;
	}

	.splash:has(button.sentence) {
		align-content: end;
		padding-block-end: var(--space-8);
	}

	.splash button {
		all: unset;
		font-size: var(--font-size-lg);
		line-height: 26px;
		cursor: pointer;
	}

	.splash button.head {
		text-align: center;
	}
	.head .title,
	.sentence .title {
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
