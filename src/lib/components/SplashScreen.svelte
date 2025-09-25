<script lang="ts">
	import { onMount } from 'svelte';

	const { sentences }: { sentences?: string[] } = $props();

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
	});
</script>

<div class="splash">
	<div class="head">
		<p class="title">draught <br />({selectedSentence})</p>
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
		line-height: 26px;
	}

	.head .title {
		font-family: 'OTParellel-cursive', 'OTParellel', serif;
		font-style: italic;
		font-weight: 400;
		font-synthesis: none; /* don't fake italic/bold */
	}
</style>
