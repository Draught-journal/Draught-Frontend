<script lang="ts">
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { useNavigation } from '$lib/components/navigation/composables/useNavigation.js';
	import { navStore } from '$lib/stores/navStore.js';

	const { sentences }: { sentences?: string[] } = $props();

	let selectedSentence = $state('');
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
	});
</script>

<div class="splash">
	<button class="head" onclick={handleHeadClick}>
		<p class="title">draught <br /><span class="sentence">({selectedSentence})</span></p>
	</button>
</div>

<style>
	.splash {
		display: grid;
		place-content: center;
		height: 100vh;
		margin-bottom: 20vh;
	}
	.splash button.head {
		all: unset;
		text-align: center;
		font-size: var(--font-size-lg);
		line-height: 26px;
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
