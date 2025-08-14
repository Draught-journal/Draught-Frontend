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
		navStore.update((store) => ({
			...store,
			activeViews: {
				...store.activeViews,
				[view]: true
			}
		}));
	}

	function showIssuesWithoutFilter() {
		navStore.update((store) => ({
			...store,
			selectedTag: null,
			activeViews: {
				...store.activeViews,
				issue: true
			}
		}));
	}

	function toggleIndex() {
		navStore.update((store) => {
			const nextIndex = !store.activeViews.index;
			let newShowIssue = store.showIssue;

			if (nextIndex) {
				// Opening index: remember previous state and ensure Issue button is visible
				prevShowIssue = store.showIssue;
				newShowIssue = false;
			} else {
				// Closing index: restore previous showIssue if we captured it
				if (prevShowIssue !== null) {
					newShowIssue = prevShowIssue;
					prevShowIssue = null;
				}
			}

			return {
				...store,
				showIssue: newShowIssue,
				activeViews: {
					...store.activeViews,
					index: nextIndex
				}
			};
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
