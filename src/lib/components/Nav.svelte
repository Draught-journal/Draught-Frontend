<script lang="ts">
	import { navStore } from '../stores/navStore.js';
	import { onMount } from 'svelte';

	let navState = $state<{
		issueText: string;
		showIssue: boolean;
		showNav: boolean;
		activeViews: {
			home: boolean;
			issue: boolean;
			index: boolean;
		};
	}>();

	navStore.subscribe((value) => {
		navState = value;
	});

	const hasActiveViews = $derived(
		navState ? Object.values(navState.activeViews).some((active) => active) : false
	);

	$effect(() => {
		if (typeof document !== 'undefined') {
			if (hasActiveViews) {
				document.body.style.overflow = 'hidden';
			} else {
				document.body.style.overflow = '';
			}
		}
	});

	function toggleView(view: 'home' | 'issue' | 'index') {
		navStore.update((store) => ({
			...store,
			activeViews: {
				...store.activeViews,
				[view]: !store.activeViews[view]
			}
		}));
	}

	onMount(() => {
		return () => {
			// Cleanup: restore body scroll on component unmount
			if (typeof document !== 'undefined') {
				document.body.style.overflow = '';
			}
		};
	});
</script>

<nav class:hidden={!navState?.showNav} class:active={hasActiveViews}>
	<div class="nav-container">
		<div id="home" class="nav-item" class:active={navState?.activeViews.home}>
			<button onclick={() => toggleView('home')}>
				<p><i>draught</i></p>
			</button>
		</div>
		<div
			id="issue"
			class="nav-item"
			class:active={navState?.activeViews.issue}
			hidden={!navState?.showIssue}
		>
			<button onclick={() => toggleView('issue')}>
				<p>{navState?.issueText}</p>
			</button>
		</div>
		<div id="index" class="nav-item" class:active={navState?.activeViews.index}>
			<button onclick={() => toggleView('index')}>
				<p>(index)</p>
			</button>
		</div>
	</div>

	<div class="nav-view">
		{#if navState?.activeViews.home}
			<div class="home-content">
				<p>About</p>
				<p>
					Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deleniti vitae natus magni
					architecto labore repellat. Unde voluptates, eos mollitia necessitatibus corrupti
					repellendus quaerat fugit tempore autem blanditiis dolor perferendis atque!
				</p>
			</div>
		{/if}
		{#if navState?.activeViews.issue}
			<div class="issue-content">
				<ul>
					<li>
						<p>(feature)</p>
						<p>Title of piece here</p>
						<p>Author Name</p>
					</li>
					<li>
						<p>(conversations)</p>
						<p>Another title here</p>
						<p>Another Author</p>
					</li>
					<li>
						<p>(adjacencies)</p>
						<p>Yet another title</p>
						<p>Last Author</p>
					</li>
					<li>
						<p>(detail)</p>
						<p>Title of piece here</p>
						<p>Author Name</p>
					</li>
				</ul>
			</div>
		{/if}
		{#if navState?.activeViews.index}
			<div class="index-content">
				<p>(issues)</p>
				<p>(feature)</p>
				<p>(conversations)</p>
				<p>(studio visits)</p>
				<p>(portfolio)</p>
				<p>(detail)</p>
				<p>(wish I'd made)</p>
				<p>(adjacencies)</p>
			</div>
		{/if}
	</div>
</nav>

<style>
	nav {
		padding: 1rem;
		width: 100%;
		/* max-width: calc(var(--content-width) * 80 / 100); */
		margin: 0 auto;
		position: fixed;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		background-color: var(--color-bg);
		border-bottom: 1px solid var(--color-border);
		z-index: 1000;
		transition:
			transform 0.3s ease-in-out,
			opacity 0.3s ease-in-out;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: min-content 1fr;
		gap: 1rem;
	}

	nav.hidden {
		transform: translateX(-50%) translateY(-100%);
		opacity: 0;
		pointer-events: none;
	}

	nav.active {
		background-color: white;
		max-height: 100dvh;
		height: 100dvh;
		overflow-y: auto;
	}

	nav p {
		margin: 0;
	}

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

	.nav-view {
		display: grid;
		grid-template-columns: subgrid;
		grid-column: 1 / -1;
		margin-top: 1rem;
		padding: 1rem 0;
		background-color: var(--color-bg);
		border-top: 1px solid var(--color-border);
		animation: slideDown 0.3s ease-in-out;
		text-align: center;
	}

	.home-content {
		grid-column: 1;
		padding: 0 1rem;
	}

	.issue-content {
		grid-column: 2;
		padding: 0 1rem;
	}

	.index-content {
		grid-column: 3;
		padding: 0 1rem;
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

	.nav-view ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.nav-view li {
		padding: 0.5rem 0;
		border-bottom: 1px solid var(--color-border);
	}

	.nav-view li:last-child {
		border-bottom: none;
	}
</style>
