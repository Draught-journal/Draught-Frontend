<script lang="ts">
	import ContentBlock from '$lib/components/ContentBlock.svelte';
	import type { ContentBlock as ContentBlockType } from '$lib/api';

	const {
		about,
		sentences,
		fullWidth = false
	}: {
		about?: ContentBlockType[];
		sentences?: string[];
		fullWidth?: boolean;
	} = $props();
</script>

<div class="home-content" class:full-width={fullWidth}>
	<div class="content">
		<!-- Show default home content -->
		<div class="sentences">
			{#if sentences && sentences.length > 0}
				{#each sentences as sentence}
					<p>({sentence})</p>
				{/each}
			{/if}
		</div>
		<br />
		{#if about && about.length > 0}
			<div class="about">
				{#each about as block}
					<ContentBlock content={block} />
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.home-content {
		/* grid-column: 1; */
		/* grid-row: 2; */
		padding: 1rem;
		max-height: calc(100dvh - 5rem);
		overflow-y: auto;
		scrollbar-width: none;
		-ms-overflow-style: none;
		border-top: 1px solid var(--color-border);
		background-color: var(--color-bg);
		animation: slideDown 0.3s ease-in-out;
		text-align: center;
		line-height: 23px;
		z-index: 1;
	}

	.content {
		max-width: calc(var(--content-width, 1200px) * 0.5);
		margin: 0 auto;
	}

	.home-content::-webkit-scrollbar {
		display: none;
	}

	.home-content .about {
		text-align: left;
	}

	:global(strong em) {
		font-family: 'OTParellel-cursive', 'OTParellel', serif;
		font-style: italic;
		font-synthesis: none;
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.home-content.full-width {
		grid-column: 1 / -1;
	}

	@media (max-width: 768px) {
		.content {
			max-width: 100%;
		}
	}
</style>
