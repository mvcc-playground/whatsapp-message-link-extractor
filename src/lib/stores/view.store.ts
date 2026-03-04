import { atom, computed } from 'nanostores';

import type { SortMode } from '$lib/domain/whatsapp/types';
import { eligibleOccurrencesStore } from './filter.store';

export interface UiPreferences {
	sortMode: SortMode;
	rowHeight: number;
}

const defaultPreferences: UiPreferences = {
	sortMode: 'chronological',
	rowHeight: 80
};

export const uiPreferencesStore = atom<UiPreferences>(defaultPreferences);

export const visibleOccurrencesStore = computed(
	[eligibleOccurrencesStore, uiPreferencesStore],
	(eligibleOccurrences, uiPreferences) => {
		const sorted = [...eligibleOccurrences].sort((a, b) => a.lineNumber - b.lineNumber);
		if (uiPreferences.sortMode === 'reverse') {
			sorted.reverse();
		}
		return sorted;
	}
);

export const viewActions = {
	setSortMode(sortMode: SortMode): void {
		uiPreferencesStore.set({
			...uiPreferencesStore.get(),
			sortMode
		});
	},
	setRowHeight(rowHeight: number): void {
		uiPreferencesStore.set({
			...uiPreferencesStore.get(),
			rowHeight: Math.min(140, Math.max(56, rowHeight))
		});
	},
	reset(): void {
		uiPreferencesStore.set(defaultPreferences);
	}
};
