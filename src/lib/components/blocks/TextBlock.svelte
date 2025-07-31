<script lang="ts">
	import type { TextContentBlock } from '$lib/api/schemas/draughtSchema';

	const { content }: { content: TextContentBlock } = $props();
</script>

<div class="text-block" data-block-id={content.id}>
	{@html content.content.text}
</div>

<style>
	.text-block {
		margin-bottom: 1.5rem;
		line-height: 1.6;
	}

	/* Responsive adjustments */
	@media (max-width: 768px) {
		.text-block {
			margin-bottom: 1rem;
		}
	}
</style>
