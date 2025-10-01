interface Callbacks {
	onHidden: () => void;
	onAllHidden: () => void;
}

const sections = new Map<string, { visible: boolean; callbacks: Callbacks }>();
let nextSectionId = 0;

function hasVisibleSections() {
	for (const section of sections.values()) {
		if (section.visible) {
			return true;
		}
	}

	return false;
}

export function createIssueVisibilityHandle(callbacks: Callbacks) {
	const id = `issue-section-${++nextSectionId}`;
	sections.set(id, { visible: false, callbacks });

	function updateVisibility(isVisible: boolean) {
		const section = sections.get(id);
		if (!section || section.visible === isVisible) {
			return;
		}

		section.visible = isVisible;

		if (!isVisible) {
			section.callbacks.onHidden();

			if (!hasVisibleSections()) {
				section.callbacks.onAllHidden();
			}
		}
	}

	function destroy() {
		const section = sections.get(id);
		sections.delete(id);

		if (!section) {
			return;
		}

		if (section.visible) {
			section.callbacks.onHidden();
		}

		if (!hasVisibleSections()) {
			section.callbacks.onAllHidden();
		}
	}

	return {
		updateVisibility,
		destroy
	};
}
