<script lang="ts">
	import Header from '$lib/components/layout/Header.svelte';
	import ContentBlock from '$lib/components/ContentBlock.svelte';
	import { createSEOData } from '$lib/seo';
	import type { Article } from '$lib/api/schemas/draughtSchema';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let article: Article | undefined = data.article;

	// Create SEO metadata
	const seoData = createSEOData({
		title: article?.title || 'Article not found',
		description: 'No description available',
		image: article?.cover.url || '',
		url: `https://draught.com/article/${article?.slug}`
	});
</script>

<Header {...seoData} />
<article>
	<div class="title">
		<!-- tag -->
		<p>({article?.tags})</p>
		<p>{article?.title || 'Article not found'}</p>
		<p>{article?.author}</p>
		<br />
		<p class="version">1.1.1</p>
		<br />
		<br />
		<br />
		<br />
	</div>

	<div class="content">
		{#if article?.content && article.content.length > 0}
			{#each article.content as block}
				<ContentBlock content={block} />
			{/each}
		{:else}
			<p>No content available for this article.</p>
		{/if}
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
</style>
