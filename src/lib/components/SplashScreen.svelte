<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { navStore } from '../stores/navStore.js';

	const { sentences, images }: { sentences?: string[]; images?: { url: string; alt: string }[] } =
		$props();

	let splashElement: HTMLDivElement;
	let observer: IntersectionObserver;
	let selectedSentence = $state('');

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
			// Fallback to random selection if localStorage fails
			console.warn('Failed to access localStorage, falling back to random selection:', error);
			return sentences[Math.floor(Math.random() * sentences.length)];
		}
	}

	onMount(() => {
		// Initialize the selected sentence
		if (sentences && sentences.length > 0) {
			selectedSentence = getRandomSentence(sentences);
		}

		if (splashElement) {
			observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.target === splashElement) {
							// Show nav when splash is almost out of view
							navStore.update((store) => ({
								...store,
								showNav: !entry.isIntersecting
							}));
						}
					});
				},
				{
					// Trigger when only 10% of the splash is visible
					threshold: 0.1,
					rootMargin: '0px'
				}
			);

			observer.observe(splashElement);
		}
	});

	onDestroy(() => {
		if (observer) {
			observer.disconnect();
		}
	});
</script>

<div class="splash" bind:this={splashElement}>
	<div class="head">
		<p class="title">draught</p>
		<p>({selectedSentence})</p>
	</div>
	<div class="thumbnails">
		<!-- 5 random image -->
		{#if images && images.length > 0}
			{#each images as image}
				<div class="image">
					<img src={image.url} alt={image.alt} />
				</div>
			{/each}
		{/if}
	</div>
</div>

<style>
	.splash .head {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
		text-align: center;
		margin-bottom: 20vh;
		font-size: var(--font-size-lg);
		line-height: 29px;
	}

	.head .title {
		font-family: 'OTParellel-cursive', 'OTParellel', serif;
		font-style: italic;
		font-weight: 400;
		font-synthesis: none; /* don't fake italic/bold */
	}

	.splash .thumbnails {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10rem;
	}

	.splash .thumbnails .image {
		position: -webkit-sticky;
		position: sticky;
		top: 50%;
		transform: translateY(-50%);
		max-width: 25rem;
	}
	.splash .thumbnails .image img {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
	}
</style>
