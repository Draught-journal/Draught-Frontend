<script lang="ts">
	import type { ContentBlock } from '$lib/api';
	import {
		isTextContentBlock,
		isImageContentBlock,
		isQuoteContentBlock,
		isLineContentBlock
	} from '$lib/api/schemas/draughtSchema';

	import TextBlock from './blocks/TextBlock.svelte';
	import ImageBlock from './blocks/ImageBlock.svelte';
	import QuoteBlock from './blocks/QuoteBlock.svelte';
	import UnknownBlock from './blocks/UnknownBlock.svelte';
	import LineBlock from './blocks/LineBlock.svelte';

	const { content }: { content: ContentBlock } = $props();
</script>

{#if !content.isHidden}
	{#if isTextContentBlock(content)}
		<TextBlock {content} />
	{:else if isImageContentBlock(content)}
		<ImageBlock {content} />
	{:else if isQuoteContentBlock(content)}
		<QuoteBlock {content} />
	{:else if isLineContentBlock(content)}
		<LineBlock />
	{:else}
		<UnknownBlock {content} />
	{/if}
{/if}
