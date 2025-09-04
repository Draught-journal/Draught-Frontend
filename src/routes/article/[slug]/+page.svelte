<script lang="ts">
	import Header from '$lib/components/layout/Header.svelte';
	import ContentBlock from '$lib/components/ContentBlock.svelte';
	import { createSEOData } from '$lib/seo';
	import type { Article } from '$lib/api/schemas/draughtSchema';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let article: Article | null = data.article;
	const errorMessage = data.errorMessage;

	// Create SEO metadata
	const seoData = createSEOData({
		title: article?.title || 'Article not found',
		description:
			article?.content?.find((block) => block.type === 'text')?.content?.text?.substring(0, 150) ||
			'No description available',
		image: article?.cover?.url || '',
		url: `https://draught.com/article/${article?.slug || ''}`
	});
</script>

<Header {...seoData} />
<article>
	<div class="title">
		<!-- tag -->
		<p>{article?.tags ? `(${article.tags})` : ''}</p>
		<p>{article?.title || 'Article not found'}</p>
		<p>{article?.author || ''}</p>
		<br />
		<p class="version">1.1.1</p>
		<br />
		<br />
		<br />
		<br />
	</div>

	<div class="content">
		{#if errorMessage}
			<p class="error">{errorMessage}</p>
		{:else if article && article.content && article.content.length > 0}
			{#each article.content as block}
				<ContentBlock content={block} />
			{/each}
		{:else}
			<p>No content available for this article.</p>
		{/if}
	</div>
	<div class="footnotes__container">
		{@html article?.footnotes || ''}
	</div>
</article>

<style>
	article {
		width: calc(var(--content-width, 1200px) * 0.5);
		margin-inline: auto;
		padding-block: 5rem;
	}
	article .title p {
		text-align: center;
		margin: 0;
		padding: 0;
		font-size: var(--font-size-lg);
		line-height: 29px;
	}

	article .title .version {
		font-variant-numeric: oldstyle-nums;
	}
	article .content p {
		font-size: var(--font-size-base);
		line-height: 23px;
		color: var(--text-color, #333);
	}

	article .content .error {
		color: var(--color-primary, #bc9200);
		text-align: center;
		font-size: var(--font-size-lg);
		margin-top: 2rem;
	}

	.footnotes__container {
		margin-top: 3rem;
		padding-block-start: 1rem;
		font-size: var(--font-size-sm);
		line-height: 1.5;
		border-top: 1px solid var(--color-border, #bebebe);
	}

	/* media query mobile */

	@media (max-width: 768px) {
		article {
			width: 90%;
		}
	}
</style>
