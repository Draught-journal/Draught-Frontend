<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { navStore } from '../stores/navStore.js';

	let splashElement: HTMLDivElement;
	let observer: IntersectionObserver;

	onMount(() => {
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
		<p>(exploring accrual and process)</p>
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
