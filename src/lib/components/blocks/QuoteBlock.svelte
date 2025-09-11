<script lang="ts">
	import type { QuoteContentBlock } from '$lib/api/schemas/draughtSchema';

	const { content }: { content: QuoteContentBlock } = $props();
</script>

<div class="quote-block" data-block-id={content.id}>
	<blockquote class="quote-content">
		<p class="quote-text">{content.content.text}</p>
		<p class="quote-text">
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione aperiam amet magnam
			necessitatibus maxime nobis ipsa, sequi, nam hic molestias rem, distinctio sint aliquam
			aspernatur rerum est voluptate aut. Totam! Lorem ipsum dolor sit amet consectetur adipisicing
			elit. Totam exercitationem dolor magni magnam fuga possimus sapiente, quasi excepturi, ipsa
			facere facilis, officia voluptate incidunt culpa sed quod delectus explicabo deleniti.
		</p>
	</blockquote>
</div>

<style>
	.quote-block {
		margin: 0 auto;
		margin-bottom: 2rem;
		width: 90%;
	}

	.quote-content {
		margin: 0;
	}

	.quote-text {
		margin: 0 0 1rem 0;
		line-height: 23px;
	}

	/* Responsive adjustments */
	@media (max-width: 768px) {
		.quote-block {
			margin-bottom: 1.5rem;
		}

		.quote-content {
			padding: 1rem;
		}

		.quote-text {
			font-size: 1em;
		}
	}
</style>
