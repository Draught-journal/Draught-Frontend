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
	}

	.text-block:not(:first-child) {
		text-indent: 2em;
	}

	/* Responsive adjustments */
</style>
