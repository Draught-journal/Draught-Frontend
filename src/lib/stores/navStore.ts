import { writable } from 'svelte/store';

export const navStore = writable({
	issueText: '',
	showIssue: false,
	showNav: false, // Initially hidden
	selectedTag: null as string | null,
	issueColor: '#000000',
	visibleSplashes: new Set<string>(), // Track which splash screens are visible
	activeViews: {
		home: false,
		issue: false,
		index: false
	}
});
