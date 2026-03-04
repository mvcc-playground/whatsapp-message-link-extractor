import { atom, computed } from 'nanostores';

import { selectedIdsStore } from './selection.store';
import { visibleOccurrencesStore } from './view.store';

export const copyStatusStore = atom<'idle' | 'success' | 'error'>('idle');

export const selectedOccurrencesStore = computed(
	[visibleOccurrencesStore, selectedIdsStore],
	(occurrences, selectedIds) => {
		return occurrences.filter((occurrence) => selectedIds.has(occurrence.occurrenceId));
	}
);

export const selectedLinksOutputStore = computed(selectedOccurrencesStore, (selectedOccurrences) => {
	return selectedOccurrences.map((item) => item.normalizedUrl).join('\n');
});

export const exportActions = {
	resetCopyState(): void {
		copyStatusStore.set('idle');
	},
	async copySelectedToClipboard(): Promise<void> {
		const payload = selectedLinksOutputStore.get();
		if (!payload.trim()) {
			copyStatusStore.set('error');
			return;
		}

		try {
			await navigator.clipboard.writeText(payload);
			copyStatusStore.set('success');
		} catch {
			copyStatusStore.set('error');
		}
	}
};
