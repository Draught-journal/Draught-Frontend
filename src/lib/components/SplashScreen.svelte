<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { navStore } from '../stores/navStore.js';

	const { sentences }: { sentences?: string[] } = $props();
	$inspect(sentences);

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
		<i>draught</i>
		<p>({selectedSentence})</p>
	</div>
	<div class="thumbnails">
		<!-- 5 random image -->
		{#each Array(5) as _, index}
			<div class="image">
				<img src={`https://picsum.photos/seed/${index}/200/200`} alt="Random thumbnail" />
			</div>
		{/each}
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
	}

	.splash .thumbnails {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16px;
	}

	.splash .thumbnails .image {
		position: -webkit-sticky;
		position: sticky;
		top: 50%;
		transform: translateY(-50%);
	}
</style>
