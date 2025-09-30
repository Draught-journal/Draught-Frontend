const visibleIssueSectionIds = new Set<string>();
let nextSectionId = 0;

function createSectionId() {
	return `issue-section-${++nextSectionId}`;
}

export function createIssueVisibilityHandle(onNoVisibleSections: () => void) {
	const id = createSectionId();

	function maybeReset() {
		if (visibleIssueSectionIds.size === 0) {
			onNoVisibleSections();
		}
	}

	return {
		markVisible() {
			visibleIssueSectionIds.add(id);
		},
		markHidden() {
			if (visibleIssueSectionIds.delete(id)) {
				maybeReset();
			}
		},
		destroy() {
			if (visibleIssueSectionIds.delete(id)) {
				maybeReset();
			}
		}
	};
}
