<script lang="ts">
</script>

<article class="issue">
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
</article>

<style>
	.issue {
		display: flex;
		flex-direction: column;
		padding: 16px;
		align-items: center;
		text-align: center;
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
