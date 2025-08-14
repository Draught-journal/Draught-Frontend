import { writable } from 'svelte/store';

export const navStore = writable({
	issueText: '',
	showIssue: false,
	showNav: false,
	selectedTag: null as string | null,
	activeViews: {
		home: false,
		issue: false,
		index: false
	}
});
