<script lang="ts">
	const {
		isArticlePage,
		navState,
		onNavigateHome,
		onToggleIndex
	}: {
		isArticlePage: boolean;
		navState: any;
		onNavigateHome: () => void;
		onToggleIndex: () => void;
	} = $props();
</script>

<div class="nav-container">
	{#if isArticlePage}
		<!-- Article page layout: only show return in third column -->
		<div id="return" class="nav-item">
			<a href="/" onclick={onNavigateHome}> (return) </a>
		</div>
	{:else}
		<!-- Default layout: show home, issue, and index -->
		<div id="home" class="nav-item" class:active={navState?.activeViews.home}>
			<a href="/" onclick={onNavigateHome}>
				<p>draught</p>
			</a>
		</div>
		<div
			id="issue"
			class="nav-item"
			class:active={navState?.activeViews.issue}
			hidden={!navState?.showIssue}
		>
			<button>
				<p>{navState?.issueText}</p>
			</button>
		</div>
		<div id="index" class="nav-item" class:active={navState?.activeViews.index}>
			<button onclick={onToggleIndex}>
				<p>(index)</p>
			</button>
		</div>
	{/if}
</div>

<style>
	.nav-container {
		display: contents;
	}

	.nav-container > * {
		text-align: center;
		width: 100%;
	}

	.nav-container #home {
		grid-column: 1;
	}

	.nav-container #issue {
		grid-column: 2;
	}

	.nav-container #index {
		grid-column: 3;
	}

	.nav-container #return {
		grid-column: 3;
	}

	.nav-item button {
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.5rem;
		width: 100%;
		transition: background-color 0.2s ease;
	}

	.nav-item button:hover {
		background-color: var(--color-border);
	}

	.nav-item.active button {
		background-color: var(--color-border);
	}

	.nav-item a {
		display: block;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.5rem;
		width: 100%;
		transition: background-color 0.2s ease;
		text-decoration: none;
		color: inherit;
	}

	.nav-item a:hover {
		background-color: var(--color-border);
	}

	#home a p {
		font-family: 'OTParellel-cursive', 'OTParellel', serif;
		font-style: italic;
		font-weight: 400;
		font-synthesis: none;
		margin: 0;
	}

	p {
		margin: 0;
	}

	@media (max-width: 768px) {
		.nav-container #home {
			grid-column: 1;
		}

		.nav-container #issue {
			/* grid-column: 1 / -1; */
			text-align: center;
		}
	}
</style>
