<script lang="ts">
	import type { TextContentBlock } from '$lib/api/schemas/draughtSchema';

	const { content }: { content: TextContentBlock } = $props();
</script>

<div class="text-block" data-block-id={content.id}>
	{@html content.content.text}
</div>

<style>
	.text-block {
		line-height: 23px;
		font-variant-numeric: oldstyle-nums;
	}

	.text-block:not(:first-child) {
		text-indent: 4rem;
	}

	:global(.heading-block + .text-block) {
		text-indent: 0 !important;
	}
	:global(.quote-block + .text-block) {
		text-indent: 0 !important;
	}

	:global(.image-block + .text-block) {
		text-indent: 0 !important;
	}

	:global(.list-block + .text-block) {
		text-indent: 0 !important;
	}
</style>
