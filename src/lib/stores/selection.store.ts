import { atom, computed } from 'nanostores';

import { eligibleOccurrenceIdsStore } from './filter.store';
import { occurrencesStore } from './ingest.store';

export const selectedIdsStore = atom<Set<string>>(new Set());

export const selectionStatsStore = computed(
	[selectedIdsStore, eligibleOccurrenceIdsStore, occurrencesStore],
	(selectedIds, eligibleIds, occurrences) => {
		let selectedEligible = 0;
		for (const id of selectedIds) {
			if (eligibleIds.has(id)) {
				selectedEligible += 1;
			}
		}
		const total = occurrences.length;
		const eligible = eligibleIds.size;
		const nonEligible = Math.max(0, total - eligible);
		const selectedTotal = selectedIds.size;
		const selectedNonEligible = Math.max(0, selectedTotal - selectedEligible);
		const invertWouldSelectTotal = Math.max(0, total - selectedTotal);

		return {
			total,
			eligible,
			nonEligible,
			selectedTotal,
			selectedEligible,
			selectedNonEligible,
			invertWouldSelectTotal
		};
	}
);

export const selectionActions = {
	toggleOccurrence(occurrenceId: string): void {
		const next = new Set(selectedIdsStore.get());
		if (next.has(occurrenceId)) {
			next.delete(occurrenceId);
		} else {
			next.add(occurrenceId);
		}
		selectedIdsStore.set(next);
	},
	selectAllEligible(): void {
		selectedIdsStore.set(new Set(eligibleOccurrenceIdsStore.get()));
	},
	clearAll(): void {
		selectedIdsStore.set(new Set());
	},
	invertEligible(): void {
		const allIds = occurrencesStore.get().map((occurrence) => occurrence.occurrenceId);
		const current = selectedIdsStore.get();
		const next = new Set<string>();

		for (const occurrenceId of allIds) {
			if (!current.has(occurrenceId)) {
				next.add(occurrenceId);
			}
		}

		selectedIdsStore.set(next);
	},
	selectUntilMessage(messageId: string): void {
		const messageLine = occurrencesStore
			.get()
			.find((occurrence) => occurrence.messageId === messageId)?.lineNumber;
		if (!messageLine) {
			return;
		}

		const ids = occurrencesStore
			.get()
			.filter((occurrence) => occurrence.lineNumber >= messageLine)
			.map((occurrence) => occurrence.occurrenceId);
		selectedIdsStore.set(new Set(ids));
	}
};
