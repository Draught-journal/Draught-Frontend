<script lang="ts">
	const { content }: { content: any } = $props();
</script>

<div class="unknown-block" data-block-id={content.id || 'unknown'}>
	<p>Unknown block type: {content.type || 'unknown'}</p>
</div>

<style>
	.unknown-block {
		padding: 1rem;
		background-color: #f0f0f0;
		border: 1px solid #ccc;
		border-radius: 4px;
		color: #666;
		font-style: italic;
		margin-bottom: 1.5rem;
	}
</style>
