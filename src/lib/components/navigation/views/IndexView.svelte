<script lang="ts">
	import type { ViewType } from '../composables/useNavigation.js';

	const {
		uniqueTags,
		onToggleView
	}: {
		uniqueTags: string[];
		onToggleView: (view: ViewType) => void;
	} = $props();
</script>

<div class="index-content">
	<button onclick={() => onToggleView('issue')}>(issues)</button>

	<!-- Display unique tags from all articles -->
	{#if uniqueTags && uniqueTags.length > 0}
		<div class="tags-section">
			{#each uniqueTags as tag}
				<p>({tag})</p>
			{/each}
		</div>
	{/if}

	<br />
	<button onclick={() => onToggleView('home')} id="about-btn">(about)</button>
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
	}

	.tags-section p {
		line-height: 23px;
		text-transform: lowercase;
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
</style>
