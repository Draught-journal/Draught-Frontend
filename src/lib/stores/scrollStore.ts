import { writable } from 'svelte/store';

export interface ScrollState {
	/** Last recorded scroll position on the home (/) page */
	homeScrollY: number | null;
	/** Flag indicating we should restore when we navigate back home */
	shouldRestore: boolean;
	/** Last recorded scroll position before opening the index */
	indexScrollY: number | null;
	/** Flag indicating we should restore when closing the index */
	shouldRestoreFromIndex: boolean;
}

export const scrollStore = writable<ScrollState>({
	homeScrollY: null,
	shouldRestore: false,
	indexScrollY: null,
	shouldRestoreFromIndex: false
});
