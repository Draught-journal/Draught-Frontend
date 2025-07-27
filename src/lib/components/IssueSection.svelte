<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import IssueCard from './IssueCard.svelte';
	import { navStore } from '../stores/navStore.js';

	type IssueData = {
		id?: string;
		title?: string;
		author?: string;
		tag?: string;
		number?: string;
		blurb?: string;
		[key: string]: any;
	};

	let {
		issueColor = '#000000',
		issues = []
	}: {
		issueColor?: string;
		issues?: IssueData[];
	} = $props();

	// For demo purposes, create 8 issues if none provided
	const displayIssues = $derived(issues.length > 0 ? issues : (Array(8).fill({}) as IssueData[]));

	let issueNumElement: HTMLDivElement;
	let observer: IntersectionObserver;

	onMount(() => {
		if (issueNumElement) {
			observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.target === issueNumElement) {
							const issueText = entry.target.textContent?.trim() || '';
							navStore.update((store) => ({
								...store,
								issueText,
								showIssue: !entry.isIntersecting
							}));
						}
					});
				},
				{
					// Trigger when the element is completely out of view
					threshold: 0,
					rootMargin: '-250px 0px 0px 0px' // Account for nav height
				}
			);

			observer.observe(issueNumElement);
		}
	});

	onDestroy(() => {
		if (observer) {
			observer.disconnect();
		}
	});
</script>

<div class="issues__wrapper" style="--issue-color: {issueColor};">
	<div class="issue__num" bind:this={issueNumElement}>
		<p>issue one</p>
	</div>
	<section class="issues">
		{#each displayIssues as issue, index}
			{@const totalItems = displayIssues.length}
			{@const remainder = totalItems % 3}
			{@const isInLastRow = remainder > 0 && index >= totalItems - remainder}
			{@const positionInLastRow = index - (totalItems - remainder)}

			{#if remainder === 2 && isInLastRow && positionInLastRow === 0}
				<!-- Create a 2-column subgrid for the last 2 items -->
				<div class="issue-wrapper double-row">
					<IssueCard />
					<IssueCard />
				</div>
			{:else if remainder === 2 && isInLastRow && positionInLastRow === 1}
				<!-- Skip the second item as it's already included in the double-row above -->
			{:else}
				<div class="issue-wrapper" class:single-last={remainder === 1 && isInLastRow}>
					<IssueCard />
				</div>
			{/if}
		{/each}
	</section>
</div>

<style>
	.issues__wrapper {
		width: 100%;
		color: var(--issue-color);
	}

	.issues__wrapper .issue__num {
		width: 100%;
		padding-block: calc(var(--space-16) * 4);
		text-align: center;
	}

	.issues {
		display: grid;
		grid-template-columns: repeat(3, minmax(20rem, 1fr));
		gap: 16px;
		place-items: center;
	}

	.issue-wrapper {
		width: 100%;
		display: flex;
		justify-content: center;
	}

	.issue-wrapper.single-last {
		grid-column: 1 / -1;
		max-width: calc(var(--content-width) * 60 / 100);
	}

	/* Two items in last row - create a 2-column subgrid spanning all columns */
	.issue-wrapper.double-row {
		grid-column: 1 / -1;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
		justify-items: center;
	}
</style>
