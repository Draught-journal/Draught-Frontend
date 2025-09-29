import { navStore } from '$lib/stores/navStore.js';
import { scrollStore } from '$lib/stores/scrollStore.js';

export type ViewType = 'home' | 'issue' | 'index';

let prevShowIssue: boolean | null = null;
let prevShowIssueForHome: boolean | null = null;
let homeScrollBeforeOpen: number | null = null;

export function useNavigation() {
	function toggleView(view: ViewType) {
		navStore.update((store) => ({
			...store,
			activeViews: {
				...store.activeViews,
				[view]: !store.activeViews[view]
			}
		}));
	}

	function showView(view: ViewType) {
		navStore.update((store) => {
			// On mobile, ensure only one main view is active at a time
			// (home and issue views share the same space on mobile)
			if (view === 'home' || view === 'issue') {
				return {
					...store,
					activeViews: {
						...store.activeViews,
						home: view === 'home',
						issue: view === 'issue',
						index: view === 'home' ? false : store.activeViews.index
					}
				};
			}

			return {
				...store,
				activeViews: {
					...store.activeViews,
					[view]: true
				}
			};
		});
	}

	function toggleHome() {
		navStore.update((store) => {
			const isHomeActive = Boolean(store.activeViews.home);

			if (isHomeActive) {
				// Closing home view
				const restoredShowIssue = prevShowIssueForHome ?? store.showIssue;
				prevShowIssueForHome = null;

				const targetScroll = homeScrollBeforeOpen;
				homeScrollBeforeOpen = null;

				if (typeof window !== 'undefined' && targetScroll !== null) {
					requestAnimationFrame(() => {
						window.scrollTo({ top: targetScroll, left: 0, behavior: 'auto' });
					});
				}

				return {
					...store,
					showIssue: restoredShowIssue,
					activeViews: {
						...store.activeViews,
						home: false
					}
				};
			}

			// Opening home view
			const wasIndexActive = Boolean(store.activeViews.index);
			let restoredShowIssue = store.showIssue;

			// Always save current scroll position when opening home view
			if (typeof window !== 'undefined') {
				homeScrollBeforeOpen = window.scrollY;
			}

			if (wasIndexActive) {
				restoredShowIssue = prevShowIssue !== null ? prevShowIssue : store.showIssue;
				prevShowIssue = null;

				// If we were in index view, restore that scroll position
				if (typeof window !== 'undefined') {
					requestAnimationFrame(() => {
						scrollStore.update((s) => {
							if (s.shouldRestoreFromIndex && s.indexScrollY !== null) {
								window.scrollTo({
									top: s.indexScrollY,
									left: 0,
									behavior: 'auto'
								});
								return {
									...s,
									shouldRestoreFromIndex: false,
									indexScrollY: null
								};
							}
							return s;
						});
					});
				}
			}

			prevShowIssueForHome = restoredShowIssue;

			return {
				...store,
				showIssue: false,
				selectedTag: wasIndexActive ? null : store.selectedTag,
				activeViews: {
					...store.activeViews,
					home: true,
					issue: false,
					index: false
				}
			};
		});
	}

	function showIssuesWithoutFilter() {
		navStore.update((store) => ({
			...store,
			selectedTag: null,
			activeViews: {
				...store.activeViews,
				home: false, // Hide home view when showing issues
				issue: true
			}
		}));
	}

	function toggleIndex() {
		navStore.update((store) => {
			const currentIndex = store.activeViews.index;

			if (!currentIndex) {
				// Opening index: save scroll position and remember previous state
				if (typeof window !== 'undefined') {
					scrollStore.update((s) => ({
						...s,
						indexScrollY: window.scrollY,
						shouldRestoreFromIndex: true
					}));
				}

				prevShowIssue = store.showIssue;
				return {
					...store,
					showIssue: false,
					activeViews: {
						home: false,
						issue: false,
						index: true
					}
				};
			} else {
				// Closing index: close all views, restore previous showIssue
				// and restore the scroll position
				const newShowIssue = prevShowIssue !== null ? prevShowIssue : store.showIssue;
				prevShowIssue = null;

				// Restore scroll position after the view updates
				if (typeof window !== 'undefined') {
					requestAnimationFrame(() => {
						scrollStore.update((s) => {
							if (s.shouldRestoreFromIndex && s.indexScrollY !== null) {
								window.scrollTo({
									top: s.indexScrollY,
									left: 0,
									behavior: 'auto'
								});
								return {
									...s,
									shouldRestoreFromIndex: false,
									indexScrollY: null
								};
							}
							return s;
						});
					});
				}

				return {
					...store,
					showIssue: newShowIssue,
					selectedTag: null,
					activeViews: {
						home: false,
						issue: false,
						index: false
					}
				};
			}
		});
	}

	function closeAllViews() {
		navStore.update((store) => ({
			...store,
			showIssue: prevShowIssue ?? store.showIssue,
			selectedTag: null,
			activeViews: { home: false, issue: false, index: false }
		}));
		prevShowIssue = null;
	}

	function setSelectedTag(tag: string) {
		navStore.update((store) => ({
			...store,
			selectedTag: tag
		}));
	}

	function clearSelectedTag() {
		navStore.update((store) => ({
			...store,
			selectedTag: null
		}));
	}

	return {
		toggleView,
		showView,
		showIssuesWithoutFilter,
		toggleHome,
		toggleIndex,
		closeAllViews,
		setSelectedTag,
		clearSelectedTag
	};
}
