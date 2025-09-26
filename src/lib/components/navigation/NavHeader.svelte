<script lang="ts">
	import { goto } from '$app/navigation';

	const {
		isArticlePage,
		navState,
		onToggleHome,
		onToggleIndex
	}: {
		isArticlePage: boolean;
		navState: any;
		onToggleHome: () => void;
		onToggleIndex: () => void;
	} = $props();
	// Store the original color
	let originalColor = '';

	// Track whether index is toggled
	let isIndexToggled = $state(false);

	// Update isIndexToggled based on navState and save original color
	$effect(() => {
		if (navState) {
			// Only update original color when it first becomes available
			if (originalColor === '' && navState.issueColor) {
				originalColor = navState.issueColor;
			}
			// Sync toggle state with navState
			isIndexToggled = navState.activeViews.index || false;
		}
	});

	// Custom index toggle handler
	function handleIndexToggle() {
		// Toggle the index via the parent component function
		onToggleIndex();
	}

	function handleHomeToggle() {
		onToggleHome();
	}

	function handleReturnHome() {
		goto('/');
	}

	// Calculate the dynamic text color style
	const textColorStyle = $derived(
		navState?.activeViews.index || navState?.activeViews.home
			? 'color: #000000;' // Black when index is toggled on
			: navState?.issueColor
				? `color: ${navState.issueColor};`
				: ''
	);
</script>

<div class="nav-container">
	{#if isArticlePage}
		<!-- Article page layout: only show return in third column -->
		<div id="return" class="nav-item">
			<button type="button" onclick={handleReturnHome} style={textColorStyle}> (return) </button>
		</div>
	{:else}
		<!-- Default layout: show home, issue, and index -->
		<div id="home" class="nav-item" class:active={navState?.activeViews.home}>
			<button type="button" onclick={handleHomeToggle} style={textColorStyle}>
				<p>draught</p>
			</button>
		</div>
		{#if navState?.activeViews.home}
			<!-- Show return button when home view is active -->
			<div id="return" class="nav-item">
				<button type="button" onclick={handleHomeToggle} style={textColorStyle}> (return) </button>
			</div>
		{:else}
			<!-- Show issue and index buttons when home view is not active -->
			<div
				id="issue"
				class="nav-item"
				class:active={navState?.activeViews.issue}
				hidden={!navState?.showIssue}
			>
				<button type="button" style={textColorStyle}>
					<p>{navState?.issueText}</p>
				</button>
			</div>
			<div id="index" class="nav-item" class:active={navState?.activeViews.index}>
				<button type="button" onclick={handleIndexToggle} style={textColorStyle}>
					<p>{isIndexToggled ? '(return)' : '(index)'}</p>
				</button>
			</div>
		{/if}
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

	.nav-container #index p {
		font-size: var(--font-size-base);
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

	#home button p {
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
