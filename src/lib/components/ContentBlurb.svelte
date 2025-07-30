<script lang="ts">
	import type { ContentBlock } from '$lib/api';
	import { isTextContentBlock } from '$lib/api/schemas/draughtSchema';

	interface Props {
		content: ContentBlock[];
		maxLength?: number;
	}

	const { content, maxLength = 150 }: Props = $props();

	// Find the first text content block and extract text
	function getBlurbText(): string {
		const firstTextBlock = content.find((block) => !block.isHidden && isTextContentBlock(block));

		if (!firstTextBlock || !isTextContentBlock(firstTextBlock)) {
			return '';
		}

		// Strip HTML tags and get plain text
		const plainText = firstTextBlock.content.text
			.replace(/<[^>]*>/g, '') // Remove HTML tags
			.replace(/\s+/g, ' ') // Normalize whitespace
			.trim();

		// Truncate if needed
		if (plainText.length <= maxLength) {
			return plainText;
		}

		// Find the last space before maxLength to avoid cutting words
		const truncated = plainText.substring(0, maxLength);
		const lastSpace = truncated.lastIndexOf(' ');

		return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
	}

	const blurbText = getBlurbText();
</script>

{#if blurbText}
	<p class="content-blurb">{blurbText}</p>
{/if}

<style>
	.content-blurb {
		margin: 0;
		line-height: 1.4;
		color: inherit;
		font-size: inherit;
	}
</style>
