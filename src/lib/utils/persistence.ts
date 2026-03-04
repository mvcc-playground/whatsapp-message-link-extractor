import { browser } from '$app/environment';

import { filterCriteriaStore, filterActions } from '$lib/stores/filter.store';
import { uiPreferencesStore, viewActions } from '$lib/stores/view.store';

const STORAGE_KEY = 'whatsapp-link-extractor:preferences:v1';

interface PersistedPreferences {
	filter: Pick<
		ReturnType<typeof filterCriteriaStore.get>,
		'authorQuery' | 'textQuery' | 'urlQuery' | 'from' | 'to'
	>;
	ui: ReturnType<typeof uiPreferencesStore.get>;
}

export function restorePreferences(): void {
	if (!browser) {
		return;
	}

	const raw = localStorage.getItem(STORAGE_KEY);
	if (!raw) {
		return;
	}

	try {
		const parsed = JSON.parse(raw) as PersistedPreferences;
		if (parsed.filter) {
			filterActions.setCriteria({
				authorQuery: parsed.filter.authorQuery ?? '',
				textQuery: parsed.filter.textQuery ?? '',
				urlQuery: parsed.filter.urlQuery ?? '',
				from: parsed.filter.from ?? '',
				to: parsed.filter.to ?? ''
			});
		}
		if (parsed.ui?.sortMode) {
			viewActions.setSortMode(parsed.ui.sortMode);
		}
		if (typeof parsed.ui?.rowHeight === 'number') {
			viewActions.setRowHeight(parsed.ui.rowHeight);
		}
	} catch {
		localStorage.removeItem(STORAGE_KEY);
	}
}

export function persistPreferences(): () => void {
	if (!browser) {
		return () => undefined;
	}

	const unsubscribeFilter = filterCriteriaStore.listen((filter) => {
		const payload: PersistedPreferences = {
			filter: {
				authorQuery: filter.authorQuery,
				textQuery: filter.textQuery,
				urlQuery: filter.urlQuery,
				from: filter.from,
				to: filter.to
			},
			ui: uiPreferencesStore.get()
		};
		localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
	});

	const unsubscribeUi = uiPreferencesStore.listen((ui) => {
		const filter = filterCriteriaStore.get();
		const payload: PersistedPreferences = {
			filter: {
				authorQuery: filter.authorQuery,
				textQuery: filter.textQuery,
				urlQuery: filter.urlQuery,
				from: filter.from,
				to: filter.to
			},
			ui
		};
		localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
	});

	return () => {
		unsubscribeFilter();
		unsubscribeUi();
	};
}