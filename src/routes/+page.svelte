<script lang="ts">
	import Header from '$lib/components/Header.svelte';
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

	const seoData = createSEOData({
		title: 'Draught',
		description: 'A digital platform for the Ghanaian creative community.',
		image: '',
		url: 'https://draught.com'
	});
</script>

<Header {...seoData} />
<SplashScreen />

{#each issues as issue (issue.id)}
	<IssueSection issueColor={issue.color} articles={issue.articles} />
{/each}
