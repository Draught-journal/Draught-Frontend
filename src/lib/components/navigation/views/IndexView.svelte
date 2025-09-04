<script lang="ts">
	import type { ViewType } from '../composables/useNavigation.js';

	const {
		uniqueTags,
		onShowView,
		onShowIssuesWithoutFilter,
		onTagFilter
	}: {
		uniqueTags: string[];
		onShowView: (view: ViewType) => void;
		onShowIssuesWithoutFilter: () => void;
		onTagFilter?: (tag: string) => void;
	} = $props();

	function handleTagClick(tag: string) {
		// If a tag filter handler is provided, use it
		if (onTagFilter) {
			onTagFilter(tag);
		}
		// Then open the issue view (this will hide home view on mobile)
		onShowView('issue');
	}

	function handleIssuesClick() {
		// Show issues view and clear any filters (this will hide home view on mobile)
		onShowIssuesWithoutFilter();
	}
</script>

<div class="index-content">
	<button onclick={handleIssuesClick}>(issues)</button>

	<!-- Display unique tags from all articles -->
	{#if uniqueTags && uniqueTags.length > 0}
		<div class="tags-section">
			{#each uniqueTags as tag}
				<button class="tag-button" onclick={() => handleTagClick(tag)}>({tag})</button>
			{/each}
		</div>
	{/if}

	<br />
	<button onclick={() => onShowView('home')} id="about-btn">(about)</button>
</div>

<style>
	.index-content {
		grid-column: 3;
		grid-row: 2;
		padding: 1rem;
		max-height: calc(100dvh - 5rem);
		overflow-y: auto;
		scrollbar-width: none;
		-ms-overflow-style: none;
		border-top: 1px solid var(--color-border);
		background-color: var(--color-bg);
		animation: slideDown 0.3s ease-in-out;
		text-align: center;
		line-height: 23px;
	}

	.index-content::-webkit-scrollbar {
		display: none;
	}

	.index-content button {
		border: none;
		background: none;
		color: inherit;
		padding: 0;
		cursor: pointer;
		font-size: var(--font-size-base);
	}

	.index-content button:hover {
		font-family: 'OTParellel-cursive', 'OTParellel', serif;
		font-style: italic;
		font-synthesis: none;
	}

	.tag-button {
		display: block;
		width: 100%;
		text-align: center;
		line-height: 23px;
		border: none;
		background: none;
		color: inherit;
		padding: 0;
		cursor: pointer;
		transition: opacity 0.2s ease;
	}

	.tag-button:hover {
		opacity: 0.7;
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (max-width: 768px) {
		.index-content {
			grid-column: 3;
			border-left: 1px solid var(--color-border);
			border-right: none;
		}
	}
</style>
