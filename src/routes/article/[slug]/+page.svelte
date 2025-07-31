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
		<br />
		<p>1.1.1</p>
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
		width: calc(var(--content-width, 1200px) * 0.6);
		margin-inline: auto;
		padding-block-start: var(--nav-height, 5rem);
	}
	article .title p {
		text-align: center;
		margin: 0;
		padding: 0;
	}
</style>
