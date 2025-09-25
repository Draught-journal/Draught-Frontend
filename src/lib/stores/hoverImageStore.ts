import { writable } from 'svelte/store';
import type { Article } from '$lib/api';

export interface HoverImagePayload {
	src: string;
	alt: string;
	title: string;
}

interface HoverImageState {
	active: HoverImagePayload | null;
}

type HoverSource = 'viewport' | 'pointer';

interface InternalEntry {
	articleId: string;
	weight: number;
	source: HoverSource;
	payload: HoverImagePayload;
}

const INITIAL_STATE: HoverImageState = { active: null };

function toEntry(article: Article, weight: number, source: HoverSource): InternalEntry | null {
	const src = article?.cover?.url;

	if (!article?.id || !src) {
		return null;
	}

	return {
		articleId: article.id,
		weight,
		source,
		payload: {
			src,
			alt: article.cover?.alt || article.title || 'Article cover',
			title: article.title || 'Untitled'
		}
	};
}

function createHoverImageStore() {
	const { subscribe, set } = writable<HoverImageState>(INITIAL_STATE);
	const entries = new Map<string, InternalEntry>();

	function entryKey(articleId: string, source: HoverSource) {
		return `${source}:${articleId}`;
	}

	function hasPointerEntries() {
		for (const key of entries.keys()) {
			if (key.startsWith('pointer:')) {
				return true;
			}
		}

		return false;
	}

	function emit() {
		if (entries.size === 0) {
			set(INITIAL_STATE);
			return;
		}

		let best: InternalEntry | null = null;

		for (const entry of entries.values()) {
			if (!best || entry.weight > best.weight) {
				best = entry;
			}
		}

		set({ active: best ? best.payload : null });
	}

	function upsert(article: Article, weight: number, source: HoverSource) {
		const entry = toEntry(article, weight, source);

		if (!entry) {
			return;
		}

		entries.set(entryKey(entry.articleId, source), entry);
		emit();
	}

	return {
		subscribe,
		setFromViewport(article: Article, ratio: number) {
			const weight = Number.isFinite(ratio) ? ratio : 0;
			upsert(article, weight, 'viewport');
		},
		setFromPointer(article: Article) {
			upsert(article, Number.POSITIVE_INFINITY, 'pointer');
		},
		clear(articleId: string, options?: { source?: HoverSource }) {
			if (options?.source) {
				const key = entryKey(articleId, options.source);

				if (!entries.delete(key)) {
					return;
				}

				if (options.source === 'pointer') {
					entries.delete(entryKey(articleId, 'viewport'));

					if (!hasPointerEntries()) {
						entries.clear();
						set(INITIAL_STATE);
						return;
					}
				}

				emit();
				return;
			}

			const removedPointer = entries.delete(entryKey(articleId, 'pointer'));
			const removedViewport = entries.delete(entryKey(articleId, 'viewport'));

			if (removedPointer || removedViewport) {
				if (!hasPointerEntries() && removedPointer) {
					entries.clear();
					set(INITIAL_STATE);
					return;
				}

				emit();
			}
		},
		reset() {
			entries.clear();
			set(INITIAL_STATE);
		}
	};
}

export const hoverImageStore = createHoverImageStore();
