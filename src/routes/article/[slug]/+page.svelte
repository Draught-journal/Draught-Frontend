<script lang="ts">
	import Header from '$lib/components/Header.svelte';
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
	<h3>{article?.title || 'Article not found'}</h3>
</article>

<style>
	article {
		max-width: var(--content-width, 1200px);
		margin-inline: auto;
		padding-block-start: var(--nav-height, 5rem);
	}
</style>
