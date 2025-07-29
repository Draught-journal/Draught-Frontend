<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import IssueSection from '$lib/components/IssueSection.svelte';
	import SplashScreen from '$lib/components/SplashScreen.svelte';
	import { createSEOData } from '$lib/seo';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	$inspect(data.props.home);

	const seoData = createSEOData({
		title: 'Draught',
		description: 'A digital platform for the Ghanaian creative community.',
		image: '',
		url: 'https://draught.com'
	});
</script>

<Header {...seoData} />
<SplashScreen />
<IssueSection issueColor="tomato" />
