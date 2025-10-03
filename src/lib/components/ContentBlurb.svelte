<script lang="ts">
	import type { ContentBlock } from '$lib/api';
	import { isTextContentBlock } from '$lib/api/schemas/draughtSchema';

	interface Props {
		content: ContentBlock[];
		maxLength?: number;
	}

	const { content, maxLength = 220 }: Props = $props();

	// Find the first text content block and extract text
	function getBlurbText(): string {
		const firstTextBlock = content.find((block) => !block.isHidden && isTextContentBlock(block));

		if (!firstTextBlock || !isTextContentBlock(firstTextBlock)) {
			return '';
		}

		// Strip HTML tags except for <em> tags
		const textWithEmTags = firstTextBlock.content.text
			.replace(/<(?!\/?em\b)[^>]*>/gi, '') // Remove all HTML tags except <em> and </em>
			.replace(/\s+/g, ' ') // Normalize whitespace
			.trim();

		// For truncation, we need to consider the text length without HTML tags
		const plainTextForLength = textWithEmTags.replace(/<[^>]*>/g, '');

		// Truncate if needed
		if (plainTextForLength.length <= maxLength) {
			return textWithEmTags;
		}

		// Find the last space before maxLength to avoid cutting words
		// We need to be careful not to cut in the middle of an <em> tag
		let charCount = 0;
		let truncationPoint = 0;
		let lastSpacePosition = 0;
		let insideTag = false;

		for (let i = 0; i < textWithEmTags.length; i++) {
			const char = textWithEmTags[i];

			if (char === '<') {
				insideTag = true;
			} else if (char === '>') {
				insideTag = false;
				continue;
			}

			if (!insideTag) {
				charCount++;
				if (char === ' ') {
					lastSpacePosition = i;
				}
				if (charCount >= maxLength) {
					truncationPoint = lastSpacePosition > 0 ? lastSpacePosition : i;
					break;
				}
			}
		}

		if (truncationPoint === 0) {
			return textWithEmTags + '...';
		}

		let truncated = textWithEmTags.substring(0, truncationPoint);

		// Ensure we don't have unclosed <em> tags
		const openEmTags = (truncated.match(/<em\b[^>]*>/gi) || []).length;
		const closeEmTags = (truncated.match(/<\/em>/gi) || []).length;

		// Add missing closing tags
		if (openEmTags > closeEmTags) {
			for (let i = 0; i < openEmTags - closeEmTags; i++) {
				truncated += '</em>';
			}
		}

		return truncated + '...';
	}

	const blurbText = getBlurbText();
</script>

{#if blurbText}
	<p class="content-blurb">{@html blurbText}</p>
{/if}

<style>
	.content-blurb {
		margin: 0;
		line-height: 1.4;
		color: inherit;
		font-size: inherit;
	}

	@media (max-width: 600px) {
		.content-blurb {
			line-height: 1.2;
		}
	}
</style>
