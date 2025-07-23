<script lang="ts">
	let showImage = false;
	let ready = false;
	let timeoutId: ReturnType<typeof setTimeout> | null = null;

	const debounceDelay = 500;
	const hoverDelay = 200;

	function transitionToImage() {
		clearTimers();
		showImage = true;
		ready = false;
		timeoutId = setTimeout(() => (ready = true), hoverDelay);
	}

	function toggleImageVisibility() {
		if (!ready) return;

		clearTimers();
		showImage = !showImage;

		if (showImage) {
			timeoutId = setTimeout(() => (ready = true), hoverDelay);
		} else {
			ready = false;
			timeoutId = setTimeout(() => (ready = true), debounceDelay);
		}
	}

	function clearTimers() {
		if (timeoutId) {
			clearTimeout(timeoutId);
			timeoutId = null;
		}
	}
</script>

<article class="issue" on:mouseenter={transitionToImage}>
	<div class="content" class:hidden={showImage}>
		<div class="heading">
			<div class="tag"><p>(feature)</p></div>
			<div class="title"><p>Title of piece here</p></div>
			<div class="author"><p>Author Name</p></div>
		</div>
		<br />
		<div class="issue__number"><p>2.1.1</p></div>
		<br /><br />
		<div class="blurb">
			<p>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
				labore et dolore magna aliqua.
			</p>
		</div>
	</div>

	<div
		class="thumbnail"
		class:visible={showImage}
		on:mouseenter={toggleImageVisibility}
		role="button"
		tabindex="0"
	>
		<img src={`https://picsum.photos/seed/${Math.random()}/200/200`} alt="Random thumbnail" />
	</div>
</article>

<style>
	.issue {
		display: flex;
		flex-direction: column;
		padding: 16px;
		align-items: center;
		text-align: center;
		position: relative;
		min-height: 300px; /* Ensure consistent height */
	}

	.content {
		transition:
			opacity 0.3s ease-in-out,
			transform 0.3s ease-in-out;
		width: 100%;
	}

	.content.hidden {
		opacity: 0;
		transform: translateY(-10px);
		pointer-events: none;
		transition:
			opacity 0.3s ease,
			transform 0.3s ease;
	}

	.thumbnail {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%) scale(0.95);
		opacity: 0;
		pointer-events: none;
		transition:
			opacity 0.3s ease,
			transform 0.3s ease;
		cursor: pointer;
	}

	.thumbnail.visible {
		opacity: 1;
		transform: translate(-50%, -50%) scale(1);
		pointer-events: auto;
	}

	.thumbnail img {
		max-width: 200px;
		max-height: 200px;
		object-fit: cover;
		border-radius: 4px;
	}

	.issue p {
		margin: 0;
	}

	.issue .heading p {
		line-height: 23px;
	}

	.issue .issue__number {
		font-size: var(--font-size-xs);
	}

	.blurb {
		margin-top: 8px;
		text-align: left;
		font-size: var(--font-size-sm);
		line-height: 19px;
		hyphens: auto;
	}
</style>
