<script lang="ts">
	import type { HeadingContentBlock as HeadingBlockType } from '$lib/api';
	const { content }: { content: HeadingBlockType } = $props();

	console.log('HeadingBlock content:', content);
</script>

<h3>{content.content.text}</h3>

<style>
	h3 {
		font-size: var(--font-size-base);
		margin-block: 2rem 1.2rem;
		font-weight: normal;
		text-align: center;
	}
</style>
