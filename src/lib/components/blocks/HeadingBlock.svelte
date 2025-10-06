<script lang="ts">
	import type { HeadingContentBlock as HeadingBlockType } from '$lib/api';
	const { content }: { content: HeadingBlockType } = $props();
</script>

<div class="heading-block">
	<h3>{@html content.content.text}</h3>
</div>

<style>
	h3 {
		font-size: var(--font-size-base);
		margin-block: 2rem 1.2rem;
		font-weight: normal;
		text-align: center;
		font-variant-numeric: oldstyle-nums;
	}
</style>
