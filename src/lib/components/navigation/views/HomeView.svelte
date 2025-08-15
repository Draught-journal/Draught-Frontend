<script lang="ts">
	import ContentBlock from '$lib/components/ContentBlock.svelte';
	import type { ContentBlock as ContentBlockType } from '$lib/api';
	import type { ArticlePreview } from '../composables/useArticles.js';

	const {
		about,
		sentences,
		hoveredArticle
	}: {
		about?: ContentBlockType[];
		sentences?: string[];
		hoveredArticle: ArticlePreview | null;
	} = $props();
</script>

<div class="home-content">
	{#if hoveredArticle}
		<!-- Show hovered article preview -->
		<div class="article-preview">
			{#if hoveredArticle.cover?.url}
				<img
					src={hoveredArticle.cover.url}
					alt={hoveredArticle.cover.alt || hoveredArticle.title}
					class="preview-image"
				/>
			{/if}
		</div>
	{:else}
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
	{/if}
</div>

<style>
	.home-content {
		grid-column: 1;
		grid-row: 2;
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

	.home-content::-webkit-scrollbar {
		display: none;
	}

	.home-content .about {
		text-align: left;
	}

	.article-preview {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		height: 100%;
		justify-content: center;
	}

	.preview-image {
		width: 100%;
		max-width: 200px;
		height: auto;
		object-fit: cover;
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

	@media (max-width: 768px) {
		.home-content {
			grid-column: 1 / 3;
			z-index: 1;
		}
	}
</style>
