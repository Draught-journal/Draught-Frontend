import { navStore } from '$lib/stores/navStore.js';
import { scrollStore } from '$lib/stores/scrollStore.js';

export type ViewType = 'home' | 'issue' | 'index';

export function useNavigation() {
	let prevShowIssue: boolean | null = null;

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
						issue: view === 'issue'
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
				// Opening index: remember previous state and ensure Issue button is visible
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
				// Closing index: close all views and restore previous showIssue
				const newShowIssue = prevShowIssue !== null ? prevShowIssue : store.showIssue;
				prevShowIssue = null;
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

	function navigateHome() {
		closeAllViews();
		scrollStore.update((s) => ({ ...s, shouldRestore: true }));
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
		toggleIndex,
		closeAllViews,
		navigateHome,
		setSelectedTag,
		clearSelectedTag
	};
}
