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
		/* margin: 1.5rem 0; */
		/* padding-inline-start: 1.5rem; */
		margin-inline-end: 4rem;
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
		list-style: none;
	}

	.list-block :global(ul li::before) {
		content: '·'; /* Bullet character */
		display: inline-block;
		width: 1em; /* Space for the bullet */
		margin-left: -1em; /* Position the bullet */
	}

	.list-block :global(ol) {
		list-style: decimal;
	}

	.list-block :global(li:last-child) {
		margin-bottom: 0;
	}

	.list-block :global(li) {
		line-height: 23px;
		font-variant-numeric: oldstyle-nums;
	}
</style>
