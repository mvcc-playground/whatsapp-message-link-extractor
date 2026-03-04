import { atom, computed } from 'nanostores';

import { parseWhatsAppText } from '$lib/domain/whatsapp/parser';
import type { ChatMessage, ExtractedLinkOccurrence, ParseWarning } from '$lib/domain/whatsapp/types';
import { emitClientLog } from '$lib/logging/client-debug';

export const rawFileNameStore = atom<string | null>(null);
export const rawTextStore = atom('');
export const messagesStore = atom<ChatMessage[]>([]);
export const occurrencesStore = atom<ExtractedLinkOccurrence[]>([]);
export const warningsStore = atom<ParseWarning[]>([]);
export const ingestErrorStore = atom<string | null>(null);

export const hasLoadedFileStore = computed(rawTextStore, (rawText) => rawText.trim().length > 0);

function applyParsedContent(rawText: string, fileName: string | null): void {
	const parsed = parseWhatsAppText(rawText);
	rawTextStore.set(rawText);
	rawFileNameStore.set(fileName);
	messagesStore.set(parsed.messages);
	occurrencesStore.set(parsed.occurrences);
	warningsStore.set(parsed.warnings);
	ingestErrorStore.set(null);
}

export const ingestActions = {
	reset(): void {
		rawFileNameStore.set(null);
		rawTextStore.set('');
		messagesStore.set([]);
		occurrencesStore.set([]);
		warningsStore.set([]);
		ingestErrorStore.set(null);
	},
	parseRawText(rawText: string, fileName: string | null = null): void {
		if (!rawText.trim()) {
			ingestErrorStore.set('O arquivo parece vazio.');
			rawFileNameStore.set(fileName);
			emitClientLog('warn', 'Rejected empty txt file', { fileName });
			return;
		}

		applyParsedContent(rawText, fileName);
		emitClientLog('info', 'TXT parsed', {
			fileName,
			rawLength: rawText.length,
			messages: messagesStore.get().length,
			occurrences: occurrencesStore.get().length,
			warnings: warningsStore.get().length
		});
	},
	async loadTxt(file: File): Promise<void> {
		if (!file.name.toLowerCase().endsWith('.txt')) {
			ingestErrorStore.set('Envie um arquivo .txt exportado do WhatsApp.');
			emitClientLog('warn', 'Rejected non-txt file', {
				fileName: file.name,
				fileType: file.type
			});
			return;
		}

		rawFileNameStore.set(file.name);
		try {
			const text = await file.text();
			ingestActions.parseRawText(text, file.name);
		} catch (error) {
			ingestErrorStore.set('Falha ao ler o arquivo selecionado.');
			emitClientLog('error', 'Failed to read file', {
				fileName: file.name,
				error: error instanceof Error ? error.message : String(error)
			});
		}
	}
};
