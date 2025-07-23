<script lang="ts">
	let showImage = false;
	let hasBeenHovered = false;
	let isDebouncing = false;
	let isImageHovered = false;
	const debounceDelay = 500; // 500ms delay between toggles

	function handleArticleHover() {
		if (!hasBeenHovered && !isDebouncing) {
			showImage = true;
			hasBeenHovered = true;
		}
	}

	function handleArticleLeave() {
		// Only reset if we're not hovering over the image
		if (!isImageHovered) {
			setTimeout(() => {
				showImage = false;
				hasBeenHovered = false;
				isDebouncing = false;
			}, 100);
		}
	}

	function handleImageHover() {
		isImageHovered = true;
		if (hasBeenHovered && !isDebouncing) {
			isDebouncing = true;
			showImage = !showImage;

			setTimeout(() => {
				isDebouncing = false;
			}, debounceDelay);
		}
	}

	function handleImageLeave() {
		isImageHovered = false;
		// Small delay before allowing article leave to reset
		setTimeout(() => {
			if (!isImageHovered) {
				showImage = false;
				hasBeenHovered = false;
				isDebouncing = false;
			}
		}, 150);
	}
</script>

<article class="issue" on:mouseenter={handleArticleHover} on:mouseleave={handleArticleLeave}>
	<div class="content" class:hidden={showImage}>
		<div class="heading">
			<div class="tag">
				<p>(feature)</p>
			</div>
			<div class="title">
				<p>Title of peice here</p>
			</div>
			<div class="aurthor">
				<p>Author Name</p>
			</div>
		</div>
		<br />
		<div class="issue__number">
			<p>2.1.1</p>
		</div>
		<br />
		<br />
		<div class="blurb">
			<p>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
				labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
				laboris nisi ut aliquip ex ea commodo consequat.
			</p>
		</div>
	</div>
	<div
		class="thumbnail"
		class:visible={showImage}
		on:mouseenter={handleImageHover}
		on:mouseleave={handleImageLeave}
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
	}

	.thumbnail {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		opacity: 0;
		transition:
			opacity 0.3s ease-in-out,
			transform 0.3s ease-in-out;
		pointer-events: none;
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
