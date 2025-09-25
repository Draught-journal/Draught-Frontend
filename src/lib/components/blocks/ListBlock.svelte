<script lang="ts">
	import type { ListContentBlock } from '$lib/api/schemas/draughtSchema';

	const { content } = $props<{ content: ListContentBlock }>();

	const html = $derived(content.content.text ?? '');
</script>

<div class="list-block" data-block-id={content.id}>
	{@html html}
</div>

<style>
	.list-block {
		margin: 1.5rem 0;
		/* padding-inline-start: 1.5rem; */
	}

	.list-block :global(ul),
	.list-block :global(ol) {
		margin: 0;
		padding-inline-start: 4rem;
		font-variant-numeric: oldstyle-nums;
		text-align: left;
		list-style-position: outside;
	}

	.list-block :global(ul) {
		list-style: disc;
	}

	.list-block :global(ol) {
		list-style: decimal;
	}

	.list-block :global(li) {
		margin-bottom: 0.5rem;
	}

	.list-block :global(li:last-child) {
		margin-bottom: 0;
	}
</style>
