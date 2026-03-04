import type {
	ChatMessage,
	ExtractedLinkOccurrence,
	ParseResult,
	ParseWarning,
	ParseWarningReason
} from './types';

const MESSAGE_LINE_REGEX = /^\u200e?\[(\d{1,2}\/\d{1,2}\/\d{4}),\s(\d{1,2}:\d{2}:\d{2})\]\s([^:]+):\s?(.*)$/;
const URL_REGEX = /(https?:\/\/[^\s<>"')\]]+|www\.[^\s<>"')\]]+)/gi;

function toDate(datePart: string, timePart: string): Date | null {
	const [day, month, year] = datePart.split('/').map((value) => Number(value));
	const [hour, minute, second] = timePart.split(':').map((value) => Number(value));
	if ([day, month, year, hour, minute, second].some((part) => Number.isNaN(part))) {
		return null;
	}

	const timestamp = new Date(year, month - 1, day, hour, minute, second);
	if (Number.isNaN(timestamp.getTime())) {
		return null;
	}

	return timestamp;
}

function normalizeUrl(url: string): string {
	const cleaned = url.trim().replace(/[.,!?;:]+$/u, '');
	if (cleaned.toLowerCase().startsWith('www.')) {
		return `https://${cleaned}`;
	}
	return cleaned;
}

function extractLinks(text: string): { url: string; normalizedUrl: string }[] {
	const matches = text.match(URL_REGEX) ?? [];
	return matches.map((match) => {
		const normalizedUrl = normalizeUrl(match);
		return {
			url: match,
			normalizedUrl
		};
	});
}

function createWarning(lineNumber: number, reason: ParseWarningReason, raw: string): ParseWarning {
	return {
		lineNumber,
		reason,
		raw
	};
}

function commitMessage(
	messages: ChatMessage[],
	occurrences: ExtractedLinkOccurrence[],
	warnings: ParseWarning[],
	current: {
		lineNumber: number;
		rawHeaderLine: string;
		author: string;
		timestamp: Date | null;
		textLines: string[];
	} | null
): void {
	if (!current) {
		return;
	}

	const text = current.textLines.join('\n').trim();
	if (!text) {
		warnings.push(createWarning(current.lineNumber, 'no_message_body', current.rawHeaderLine));
		return;
	}

	if (!current.timestamp) {
		warnings.push(createWarning(current.lineNumber, 'invalid_date', current.rawHeaderLine));
	}

	const links = extractLinks(text);
	const messageId = `m-${current.lineNumber}`;
	const message: ChatMessage = {
		id: messageId,
		lineNumber: current.lineNumber,
		rawHeaderLine: current.rawHeaderLine,
		timestamp: current.timestamp,
		author: current.author,
		text,
		hasLink: links.length > 0,
		links: links.map((item) => item.normalizedUrl)
	};

	messages.push(message);

	links.forEach((link, index) => {
		occurrences.push({
			occurrenceId: `o-${current.lineNumber}-${index + 1}`,
			messageId,
			lineNumber: current.lineNumber,
			timestamp: current.timestamp,
			author: current.author,
			url: link.url,
			normalizedUrl: link.normalizedUrl
		});
	});
}

export function parseWhatsAppText(rawText: string): ParseResult {
	const lines = rawText.split(/\r?\n/);
	const messages: ChatMessage[] = [];
	const occurrences: ExtractedLinkOccurrence[] = [];
	const warnings: ParseWarning[] = [];

	let currentMessage: {
		lineNumber: number;
		rawHeaderLine: string;
		author: string;
		timestamp: Date | null;
		textLines: string[];
	} | null = null;

	for (let index = 0; index < lines.length; index += 1) {
		const rawLine = lines[index]?.replace(/^\u200e/u, '') ?? '';
		const lineNumber = index + 1;
		const match = MESSAGE_LINE_REGEX.exec(rawLine);

		if (match) {
			commitMessage(messages, occurrences, warnings, currentMessage);
			const [, datePart, timePart, authorPart, textPart] = match;
			currentMessage = {
				lineNumber,
				rawHeaderLine: rawLine,
				author: authorPart.trim(),
				timestamp: toDate(datePart, timePart),
				textLines: textPart ? [textPart] : []
			};
			continue;
		}

		if (currentMessage) {
			currentMessage.textLines.push(rawLine);
			continue;
		}

		if (rawLine.trim().length > 0) {
			warnings.push(createWarning(lineNumber, 'invalid_format', rawLine));
		}
	}

	commitMessage(messages, occurrences, warnings, currentMessage);

	return {
		messages,
		occurrences,
		warnings
	};
}