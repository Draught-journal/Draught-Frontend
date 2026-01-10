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

	function handleReturn() {
		goto('/');
	}
</script>

<Header {...seoData} />

<div class="accessibility-page">
	<nav class="page-nav">
		<div class="nav-container">
			<div class="nav-item home">
				<a href="/">
					<p>draught</p>
				</a>
			</div>
			<div class="nav-item return">
				<button type="button" onclick={handleReturn}>(return)</button>
			</div>
		</div>
	</nav>

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
	.accessibility-page {
		min-height: 100dvh;
	}

	.page-nav {
		padding-block-start: 1rem;
		width: 100%;
		margin: 0 auto;
		position: fixed;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		background-color: var(--color-bg);
		border-bottom: 1px solid var(--color-border);
		z-index: 1000;
	}

	.nav-container {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		max-width: var(--content-width);
		margin: 0 auto;
	}

	.nav-item {
		text-align: center;
		width: 100%;
	}

	.nav-item.home {
		grid-column: 1;
	}

	.nav-item.return {
		grid-column: 3;
	}

	.nav-item a,
	.nav-item button {
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.5rem;
		width: 100%;
		display: block;
		text-decoration: none;
		color: inherit;
	}

	.nav-item.home p {
		font-family: 'OTParellel-cursive', 'OTParellel', serif;
		font-style: italic;
		font-weight: 400;
		font-synthesis: none;
		margin: 0;
	}

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
