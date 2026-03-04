import { atom, computed } from 'nanostores';

import type { ExtractedLinkOccurrence, FilterCriteria } from '$lib/domain/whatsapp/types';
import { messagesStore, occurrencesStore } from './ingest.store';

export const filterCriteriaStore = atom<FilterCriteria>({
	authorQuery: '',
	textQuery: '',
	urlQuery: '',
	from: '',
	to: '',
	untilMessageId: null
});

const messageByIdStore = computed(messagesStore, (messages) => {
	return new Map(messages.map((message) => [message.id, message]));
});

function includesQuery(value: string | null | undefined, query: string): boolean {
	if (!query.trim()) {
		return true;
	}
	return (value ?? '').toLowerCase().includes(query.trim().toLowerCase());
}

function toDateOrNull(rawDate: string): Date | null {
	if (!rawDate) {
		return null;
	}
	const parsed = new Date(rawDate);
	return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function isWithinDateRange(occurrence: ExtractedLinkOccurrence, from: Date | null, to: Date | null): boolean {
	if (!from && !to) {
		return true;
	}
	if (!occurrence.timestamp) {
		return false;
	}
	if (from && occurrence.timestamp < from) {
		return false;
	}
	if (to && occurrence.timestamp > to) {
		return false;
	}
	return true;
}

export const eligibleOccurrencesStore = computed(
	[occurrencesStore, messageByIdStore, filterCriteriaStore],
	(occurrences, messageById, criteria) => {
		const fromDate = toDateOrNull(criteria.from);
		const toDate = toDateOrNull(criteria.to);
		const untilMessage = criteria.untilMessageId ? messageById.get(criteria.untilMessageId) : null;
		const untilLine = untilMessage?.lineNumber ?? Number.POSITIVE_INFINITY;

		return occurrences.filter((occurrence) => {
			const sourceMessage = messageById.get(occurrence.messageId);
			const author = sourceMessage?.author ?? occurrence.author;
			const text = sourceMessage?.text ?? '';

			if (occurrence.lineNumber > untilLine) {
				return false;
			}
			if (!includesQuery(author, criteria.authorQuery)) {
				return false;
			}
			if (!includesQuery(text, criteria.textQuery)) {
				return false;
			}
			if (!includesQuery(occurrence.normalizedUrl, criteria.urlQuery)) {
				return false;
			}
			if (!isWithinDateRange(occurrence, fromDate, toDate)) {
				return false;
			}

			return true;
		});
	}
);

export const eligibleOccurrenceIdsStore = computed(eligibleOccurrencesStore, (occurrences) => {
	return new Set(occurrences.map((occurrence) => occurrence.occurrenceId));
});

export const filterActions = {
	setCriteria(partial: Partial<FilterCriteria>): void {
		filterCriteriaStore.set({
			...filterCriteriaStore.get(),
			...partial
		});
	},
	setUntilMessage(untilMessageId: string | null): void {
		this.setCriteria({ untilMessageId });
	},
	reset(): void {
		filterCriteriaStore.set({
			authorQuery: '',
			textQuery: '',
			urlQuery: '',
			from: '',
			to: '',
			untilMessageId: null
		});
	}
};
