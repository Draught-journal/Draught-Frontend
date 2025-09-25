<script lang="ts">
	import type { Issue, Article } from '$lib/api';
	import { hoverImageStore } from '$lib/stores/hoverImageStore.js';

	const {
		issues,
		selectedTag: initialSelectedTag,
		onCloseAllViews
	}: {
		issues?: Issue[];
		selectedTag?: string | null;
		onCloseAllViews: () => void;
	} = $props();

	let selectedTag = $state<string | null>(initialSelectedTag || null);

	// Get all articles that match the selected tag with their issue colors
	function getFilteredArticles(): Array<Article & { issueColor: string }> {
		if (!selectedTag || !issues) return [];

		const filteredArticles: Array<Article & { issueColor: string }> = [];
		issues.forEach((issue) => {
			if (issue.articles && issue.articles.length > 0) {
				issue.articles.forEach((article) => {
					if (article.tags && article.tags.includes(selectedTag!)) {
						filteredArticles.push({
							...article,
							issueColor: issue.color
						});
					}
				});
			}
		});
		return filteredArticles;
	}

	const filteredArticles = $derived(getFilteredArticles());

	// Update local selectedTag when prop changes
	$effect(() => {
		selectedTag = initialSelectedTag || null;
	});

	// Hover image handlers
	function handlePointerEnter(article: Article) {
		hoverImageStore.setFromPointer(article);
	}

	function handlePointerLeave(article: Article) {
		hoverImageStore.clear(article.id, { source: 'pointer' });
	}
</script>

<div class="issue-content">
	{#if selectedTag}
		<!-- Filtered articles view -->
		<div class="filtered-content">
			{#if filteredArticles.length > 0}
				<ul class="filtered-articles">
					{#each filteredArticles as article}
						<a
							href={`article/${article.slug}`}
							onclick={onCloseAllViews}
							onfocusin={() => handlePointerEnter(article)}
							onfocusout={() => handlePointerLeave(article)}
							onmouseenter={() => handlePointerEnter(article)}
							onmouseleave={() => handlePointerLeave(article)}
						>
							<li
								class="filtered-article-item"
								style="--issue-color: {article.issueColor}"
								data-cover={article.cover.url}
								data-alt-text={article.cover.alt}
							>
								<p>({article.tags.join(', ')})</p>
								<p>{article.title}</p>
								<p>{article.author}</p>
							</li>
						</a>
					{/each}
				</ul>
			{:else}
				<p class="no-articles">No articles found for this tag.</p>
			{/if}
		</div>
	{:else}
		<!-- Default issues view -->
		{#if issues && issues.length > 0}
			{#each issues as issue}
				{#if issue.articles && issue.articles.length > 0}
					<div class="issue-section" style="--issue-color: {issue.color}">
						<p>{issue.title}</p>
						<br />
						<ul>
							{#each issue.articles as article}
								<a
									href={`article/${article.slug}`}
									onclick={onCloseAllViews}
									onfocusin={() => handlePointerEnter(article)}
									onfocusout={() => handlePointerLeave(article)}
									onmouseenter={() => handlePointerEnter(article)}
									onmouseleave={() => handlePointerLeave(article)}
								>
									<li data-cover={article.cover.url} data-alt-text={article.cover.alt}>
										<p>({article.tags.join(', ')})</p>
										<p>{article.title}</p>
										<p>{article.author}</p>
									</li>
								</a>
							{/each}
						</ul>
					</div>
				{/if}
			{/each}
		{/if}
	{/if}
</div>

<style>
	.issue-content {
		grid-column: 2;
		grid-row: 1 / -1;
		padding: 1rem;
		overflow-y: auto;
		scrollbar-width: none;
		-ms-overflow-style: none;
		border-top: 1px solid var(--color-border);
		border-left: 1px solid var(--color-border);
		border-right: 1px solid var(--color-border);
		background-color: var(--color-bg);
		animation: slideDown 0.3s ease-in-out;
		text-align: center;
		line-height: 23px;
		margin-top: -1rem;
		padding-top: 2rem;
	}

	.issue-content::-webkit-scrollbar {
		display: none;
	}

	.filtered-articles {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.filtered-article-item {
		color: var(--issue-color, #000000);
	}

	.no-articles {
		color: var(--color-border);
		font-style: italic;
	}

	.issue-section {
		color: var(--issue-color, #000000);
		margin-bottom: 2rem;
	}

	.issue-section:last-child {
		margin-bottom: 0;
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	li {
		padding: 0.5rem 0;
		border-bottom: 1px solid var(--color-border);
	}

	li:last-child {
		border-bottom: none;
	}

	a {
		text-decoration: none;
		color: inherit;
	}

	a:hover li p {
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

	@media (max-width: 768px) {
		.issue-content {
			grid-column: 1 / 3;
			grid-row: auto;
			border-left: none;
			border-right: 1px solid var(--color-border);
			z-index: 1;
		}
	}
</style>
