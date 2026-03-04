import { browser } from '$app/environment';

export type ClientLogLevel = 'info' | 'warn' | 'error';

export interface ClientLogEvent {
	at: string;
	level: ClientLogLevel;
	message: string;
	context?: unknown;
}

const BUFFER_LIMIT = 20;
const FLUSH_INTERVAL_MS = 1500;

let queue: ClientLogEvent[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

function scheduleFlush(): void {
	if (!browser || flushTimer) {
		return;
	}
	flushTimer = setTimeout(() => {
		flushTimer = null;
		void flushLogs();
	}, FLUSH_INTERVAL_MS);
}

async function flushLogs(): Promise<void> {
	if (!browser || queue.length === 0) {
		return;
	}

	const events = queue;
	queue = [];

	try {
		await fetch('/api/client-logs', {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({ events }),
			keepalive: true
		});
	} catch {
		queue = [...events, ...queue].slice(-BUFFER_LIMIT * 2);
	}
}

export function emitClientLog(level: ClientLogLevel, message: string, context?: unknown): void {
	if (!browser) {
		return;
	}

	queue.push({
		at: new Date().toISOString(),
		level,
		message,
		context
	});

	if (queue.length >= BUFFER_LIMIT) {
		void flushLogs();
		return;
	}

	scheduleFlush();
}

export function startClientLogFlushOnUnload(): () => void {
	if (!browser) {
		return () => undefined;
	}

	const handleVisibility = (): void => {
		if (document.visibilityState === 'hidden') {
			void flushLogs();
		}
	};

	document.addEventListener('visibilitychange', handleVisibility);

	return () => {
		document.removeEventListener('visibilitychange', handleVisibility);
		if (flushTimer) {
			clearTimeout(flushTimer);
			flushTimer = null;
		}
		void flushLogs();
	};
}