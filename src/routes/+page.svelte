<script lang="ts">
	import Header from '$lib/components/layout/Header.svelte';
	import SplashScreen from '$lib/components/SplashScreen.svelte';
	import IssueSection from '$lib/components/IssueSection.svelte';
	import HoverImageSection from '$lib/components/HoverImageSection.svelte';

	import { createSEOData } from '$lib/seo';
	import type { PageData } from './$types';
	import type { Issue } from '$lib/api';

	export let data: PageData;

	const issues: Issue[] = Array.isArray(data.props?.site?.issues)
		? data.props.site.issues
		: data.props?.site?.issues
			? [data.props.site.issues]
			: [];

	const seoData = createSEOData({
		title: 'Draught',
		description: 'A digital platform for a creative community.',
		image: '',
		url: 'https://draught.com'
	});
</script>

<Header {...seoData} />
<SplashScreen sentences={data.props?.site?.sentences} />

{#each issues as issue, issueIndex (issue.id)}
	<IssueSection
		issueColor={issue.color}
		articles={issue.articles}
		grid={issue.grid}
		issueTitle={issue.title}
	/>
{/each}

<SplashScreen sentences={data.props?.site?.sentences} />
<HoverImageSection />
