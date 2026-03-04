export type ParseWarningReason = 'invalid_format' | 'invalid_date' | 'no_message_body';

export interface RawMessageLine {
	lineNumber: number;
	raw: string;
}

export interface ChatMessage {
	id: string;
	lineNumber: number;
	rawHeaderLine: string;
	timestamp: Date | null;
	author: string | null;
	text: string;
	hasLink: boolean;
	links: string[];
}

export interface ExtractedLinkOccurrence {
	occurrenceId: string;
	messageId: string;
	lineNumber: number;
	timestamp: Date | null;
	author: string | null;
	url: string;
	normalizedUrl: string;
}

export interface ParseWarning {
	lineNumber: number;
	reason: ParseWarningReason;
	raw: string;
}

export interface ParseResult {
	messages: ChatMessage[];
	occurrences: ExtractedLinkOccurrence[];
	warnings: ParseWarning[];
}

export interface FilterCriteria {
	authorQuery: string;
	textQuery: string;
	urlQuery: string;
	from: string;
	to: string;
	untilMessageId: string | null;
}

export type SortMode = 'chronological' | 'reverse';