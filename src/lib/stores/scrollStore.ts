import { writable } from 'svelte/store';

export interface ScrollState {
	/** Last recorded scroll position on the home (/) page */
	homeScrollY: number | null;
	/** Flag indicating we should restore when we navigate back home */
	shouldRestore: boolean;
}

export const scrollStore = writable<ScrollState>({
	homeScrollY: null,
	shouldRestore: false
});
