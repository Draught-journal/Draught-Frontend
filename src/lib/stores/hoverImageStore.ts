import { writable } from 'svelte/store';
import type { Article } from '$lib/api';

export type HoverImageScale = 'small' | 'medium' | 'large';

export interface HoverImageDetails {
	articleId: string;
	slug?: string;
	title: string;
	author?: string;
	src: string;
	alt: string;
	scale: HoverImageScale;
}

interface HoverImageState {
	active: HoverImageDetails | null;
}

type HoverSource = 'viewport' | 'pointer';

interface InternalEntry {
	details: HoverImageDetails;
	weight: number;
	source: HoverSource;
}

const INITIAL_STATE: HoverImageState = { active: null };

function resolveScale(article: Article): HoverImageScale {
	const { scale, cover } = article;

	if (scale === 'small' || scale === 'large' || scale === 'medium') {
		return scale;
	}

	const coverScale = cover?.scale;

	if (coverScale === 'small' || coverScale === 'large' || coverScale === 'medium') {
		return coverScale;
	}

	return 'medium';
}

function toDetails(article: Article): HoverImageDetails | null {
	const src = article?.cover?.url;

	if (!article?.id || !src) {
		return null;
	}

	return {
		articleId: article.id,
		slug: article.slug,
		title: article.title,
		author: article.author,
		src,
		alt: article.cover?.alt || article.title || 'Article cover',
		scale: resolveScale(article)
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

		let bestEntry: InternalEntry | null = null;

		for (const entry of entries.values()) {
			if (!bestEntry || entry.weight > bestEntry.weight) {
				bestEntry = entry;
			}
		}

		set({ active: bestEntry ? bestEntry.details : null });
	}

	function upsert(article: Article, weight: number, source: HoverSource) {
		const details = toDetails(article);

		if (!details) {
			return;
		}

		entries.set(entryKey(details.articleId, source), { details, weight, source });
		emit();
	}

	return {
		subscribe,
		setFromViewport(article: Article, ratio: number) {
			const weight = Number.isFinite(ratio) ? ratio : 0;
			upsert(article, weight, 'viewport');
		},
		setFromPointer(article: Article) {
			// Give pointer interactions precedence over scroll-based entries
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
				}

				if (options.source === 'pointer' && !hasPointerEntries()) {
					set(INITIAL_STATE);
					return;
				}

				emit();
				return;
			}

			const removedPointer = entries.delete(entryKey(articleId, 'pointer'));
			const removedViewport = entries.delete(entryKey(articleId, 'viewport'));

			if (removedPointer || removedViewport) {
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
