import { writable } from 'svelte/store';
import type { Article } from '$lib/api';

export interface HoverImagePayload {
	articleId: string;
	scale: 'large' | 'medium' | 'small';
	src: string;
	alt: string;
	title: string;
}

interface HoverImageState {
	active: HoverImagePayload | null;
	stack: HoverImagePayload[];
}

type HoverSource = 'viewport' | 'pointer';

interface InternalEntry {
	articleId: string;
	weight: number;
	source: HoverSource;
	payload: HoverImagePayload;
}

const STACK_LIMIT = 12;
const INITIAL_STATE: HoverImageState = { active: null, stack: [] };

function toEntry(article: Article, weight: number, source: HoverSource): InternalEntry | null {
	const src = article?.cover?.url;

	if (!article?.id || !src) {
		return null;
	}

	const scale = (article.scale || article.cover?.scale || 'medium') as HoverImagePayload['scale'];

	return {
		articleId: article.id,
		weight,
		source,
		payload: {
			articleId: article.id,
			scale,
			src,
			alt: article.cover?.alt || article.title || 'Article cover',
			title: article.title || 'Untitled'
		}
	};
}

function createHoverImageStore() {
	const { subscribe, set } = writable<HoverImageState>(INITIAL_STATE);
	const entries = new Map<string, InternalEntry>();
	const stackOrder: string[] = [];
	const stackValues = new Map<string, HoverImagePayload>();

	function entryKey(articleId: string, source: HoverSource) {
		return `${source}:${articleId}`;
	}

	function ensureOrder(articleId: string) {
		const currentIndex = stackOrder.indexOf(articleId);

		if (currentIndex !== -1) {
			stackOrder.splice(currentIndex, 1);
		}

		stackOrder.push(articleId);

		if (stackOrder.length > STACK_LIMIT) {
			const removedId = stackOrder.shift();

			if (removedId) {
				stackValues.delete(removedId);
			}
		}
	}

	function currentStack() {
		return stackOrder
			.map((id) => stackValues.get(id))
			.filter((payload): payload is HoverImagePayload => Boolean(payload));
	}

	function hasPointerEntries() {
		for (const key of entries.keys()) {
			if (key.startsWith('pointer:')) {
				return true;
			}
		}

		return false;
	}

	function emit(preferredActiveId?: string) {
		if (entries.size === 0) {
			const stack = currentStack();
			set({ active: null, stack });
			return;
		}

		let best: InternalEntry | null = null;

		for (const entry of entries.values()) {
			if (!best || entry.weight > best.weight) {
				best = entry;
			}
		}

		const activeEntry = preferredActiveId
			? [...entries.values()].find((entry) => entry.articleId === preferredActiveId) ?? best
			: best;

		if (activeEntry) {
			ensureOrder(activeEntry.articleId);
			stackValues.set(activeEntry.articleId, activeEntry.payload);
		}

		const stack = currentStack();
		set({ active: activeEntry ? activeEntry.payload : null, stack });
	}

	function upsert(article: Article, weight: number, source: HoverSource) {
		const entry = toEntry(article, weight, source);

		if (!entry) {
			return;
		}

		entries.set(entryKey(entry.articleId, source), entry);
		stackValues.set(entry.articleId, entry.payload);
		emit(entry.articleId);
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
						const stack = currentStack();
						set({ active: null, stack });
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
					const stack = currentStack();
					set({ active: null, stack });
					return;
				}

				emit();
			}
		},
		reset() {
			entries.clear();
			stackOrder.length = 0;
			stackValues.clear();
			set(INITIAL_STATE);
		}
	};
}

export const hoverImageStore = createHoverImageStore();
