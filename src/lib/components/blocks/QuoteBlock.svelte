<script lang="ts">
	import type { QuoteContentBlock } from '$lib/api/schemas/draughtSchema';

	const { content }: { content: QuoteContentBlock } = $props();
</script>

<div class="quote-block" data-block-id={content.id}>
	<blockquote class="quote-content">
		<p class="quote-text">"{content.content.text}"</p>
		<cite class="quote-citation">— {content.content.citation}</cite>
	</blockquote>
</div>

<style>
	.quote-block {
		margin-bottom: 2rem;
	}

	.quote-content {
		margin: 0;
		padding: 1.5rem;
		background-color: var(--color-bg, #f9f9f9);
	}

	.quote-text {
		margin: 0 0 1rem 0;
		font-size: 1.1em;
		line-height: 1.6;
	}

	.quote-citation {
		display: block;
		margin: 0;
		font-size: 0.9em;
		font-style: normal;
		font-weight: 500;
		text-align: right;
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

		.quote-citation {
			font-size: 0.8em;
		}
	}
</style>
