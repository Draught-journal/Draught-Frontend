<script lang="ts">
	import { goto } from '$app/navigation';
	import ContentBlock from '$lib/components/ContentBlock.svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import { createSEOData } from '$lib/seo';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const seoData = createSEOData({
		title: 'Accessibility Statement | draught',
		description: 'Accessibility statement for draught magazine',
		url: 'https://draught.com/accessibility'
	});
</script>

<Header {...seoData} />

<div class="accessibility-page">
	<div class="content-wrapper">
		<div class="content">
			{#if data.accessibilityStatement && data.accessibilityStatement.length > 0}
				{#each data.accessibilityStatement as block (block.id)}
					<ContentBlock content={block} />
				{/each}
			{:else}
				<p>No accessibility statement available.</p>
			{/if}
		</div>
	</div>
</div>

<style>
	.content-wrapper {
		padding-block: 5rem 2rem;
		max-width: var(--content-width);
		margin: 0 auto;
	}

	.content {
		max-width: calc(var(--content-width, 1200px) * 0.5);
		margin: 0 auto;
		padding: 1rem;
		text-align: left;
		line-height: 23px;
	}
</style>
