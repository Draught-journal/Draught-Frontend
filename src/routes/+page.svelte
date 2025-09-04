<script lang="ts">
	import Header from '$lib/components/layout/Header.svelte';
	import SplashScreen from '$lib/components/SplashScreen.svelte';
	import IssueSection from '$lib/components/IssueSection.svelte';

	import { createSEOData } from '$lib/seo';
	import type { PageData } from './$types';
	import type { Issue } from '$lib/api';

	export let data: PageData;

	const issues: Issue[] = Array.isArray(data.props?.site?.issues)
		? data.props.site.issues
		: data.props?.site?.issues
			? [data.props.site.issues]
			: [];

	const articleCoverImages = data.props.site?.issues
		? data.props.site.issues.flatMap((issue) =>
				issue.articles
					.filter((article) => article.cover && article.cover.url)
					.map((article) => ({
						url: article.cover.url,
						alt: article.cover.alt || `Cover image for ${article.title}`,
						articleUrl: article.slug ? `/article/${article.slug}` : '#'
					}))
			)
		: [];

	const seoData = createSEOData({
		title: 'Draught',
		description: 'A digital platform for the Ghanaian creative community.',
		image: '',
		url: 'https://draught.com'
	});
</script>

<Header {...seoData} />
<SplashScreen sentences={data.props?.site?.sentences} images={articleCoverImages} />

{#each issues as issue (issue.id)}
	<IssueSection issueColor={issue.color} articles={issue.articles} />
{/each}
