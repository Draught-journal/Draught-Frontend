<script lang="ts">
	import type { QuoteContentBlock } from '$lib/api/schemas/draughtSchema';
	const { content }: { content: QuoteContentBlock } = $props();
</script>

<div class="quote-block" data-block-id={content.id}>
	<blockquote class="quote-content">
		<p class="quote-text">{@html content.content.text}</p>
	</blockquote>
</div>

<style>
	.quote-block {
		margin-inline: var(--block-margin);
	}

	.quote-content {
		margin: 0;
	}

	.quote-text {
		margin: 0;
		line-height: 23px;
		font-variant-numeric: oldstyle-nums;
	}

	/* Responsive adjustments */
	@media (max-width: 768px) {
		.quote-block {
			margin-bottom: 1.5rem;
		}
	}
</style>
