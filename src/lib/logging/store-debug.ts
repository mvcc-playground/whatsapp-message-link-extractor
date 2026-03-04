import { browser } from '$app/environment';
import { logger } from '@nanostores/logger';

import {
	copyStatusStore,
	filterCriteriaStore,
	hasLoadedFileStore,
	ingestErrorStore,
	messagesStore,
	occurrencesStore,
	rawFileNameStore,
	selectionStatsStore,
	selectedIdsStore,
	uiPreferencesStore,
	warningsStore
} from '$lib/stores';

import { emitClientLog } from './client-debug';

function buildSummary(): Record<string, unknown> {
	const stats = selectionStatsStore.get();
	return {
		hasLoadedFile: hasLoadedFileStore.get(),
		fileName: rawFileNameStore.get(),
		messages: messagesStore.get().length,
		occurrences: occurrencesStore.get().length,
		warnings: warningsStore.get().length,
		selected: selectedIdsStore.get().size,
		eligible: stats.eligible,
		ingestError: ingestErrorStore.get()
	};
}

export function startStoreDebugging(): () => void {
	if (!browser) {
		return () => undefined;
	}

	const destroyConsoleLogger = logger({
		rawFileNameStore,
		hasLoadedFileStore,
		ingestErrorStore,
		messagesStore,
		occurrencesStore,
		warningsStore,
		filterCriteriaStore,
		selectedIdsStore,
		selectionStatsStore,
		copyStatusStore,
		uiPreferencesStore
	});

	const unbind = [
		messagesStore.listen((messages) => {
			emitClientLog('info', 'messagesStore updated', {
				count: messages.length,
				summary: buildSummary()
			});
		}),
		occurrencesStore.listen((occurrences) => {
			emitClientLog('info', 'occurrencesStore updated', {
				count: occurrences.length,
				summary: buildSummary()
			});
		}),
		ingestErrorStore.listen((error) => {
			if (!error) {
				return;
			}
			emitClientLog('error', 'ingestErrorStore updated', {
				error,
				summary: buildSummary()
			});
		}),
		warningsStore.listen((warnings) => {
			if (warnings.length === 0) {
				return;
			}
			emitClientLog('warn', 'warningsStore updated', {
				count: warnings.length,
				first: warnings[0],
				summary: buildSummary()
			});
		})
	];

	emitClientLog('info', 'store debug session started', {
		summary: buildSummary()
	});

	return () => {
		for (const stop of unbind) {
			stop();
		}
		destroyConsoleLogger();
		emitClientLog('info', 'store debug session stopped', {
			summary: buildSummary()
		});
	};
}