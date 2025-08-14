<script lang="ts">
	import type { Issue } from '$lib/api';
	import type { ArticlePreview } from '../composables/useArticles.js';

	const {
		issues,
		onCloseAllViews,
		onArticleHover,
		onArticleLeave
	}: {
		issues?: Issue[];
		onCloseAllViews: () => void;
		onArticleHover: (article: ArticlePreview) => void;
		onArticleLeave: () => void;
	} = $props();
</script>

<div class="issue-content">
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
								onmouseenter={() => onArticleHover(article)}
								onmouseleave={onArticleLeave}
							>
								<li data-cover={article.cover.url} data-alt-text={article.cover.alt}>
									<p>({article.tags})</p>
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
</style>
