<script lang="ts">
	import { navStore } from '../stores/navStore.js';
</script>

<nav class:hidden={!$navStore.showNav}>
	<div class="nav-container">
		<a href="/" class="logo"><i>draught</i></a>
		<div id="issue" hidden={!$navStore.showIssue}>
			<p>{$navStore.issueText}</p>
		</div>
		<div id="index">
			<p>(index)</p>
		</div>
	</div>
</nav>

<style>
	nav {
		padding: 1rem;
		width: 100%;
		max-width: calc(var(--content-width) * 60 / 100);
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
	}

	nav.hidden {
		transform: translateX(-50%) translateY(-100%);
		opacity: 0;
		pointer-events: none;
	}

	nav p {
		margin: 0;
	}

	.nav-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>
