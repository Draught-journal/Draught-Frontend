import { writable } from 'svelte/store';

export const navStore = writable({
	issueText: '',
	showIssue: false,
	showNav: false,
	activeViews: {
		home: false,
		issue: false,
		index: false
	}
});
