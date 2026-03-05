import { json } from '@sveltejs/kit';
import { dev } from '$app/environment';
import type { RequestHandler } from './$types';

interface IncomingLogEvent {
	at?: string;
	level?: 'info' | 'warn' | 'error';
	message?: string;
	context?: unknown;
}

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	let payload: { events?: IncomingLogEvent[] };
	try {
		payload = (await request.json()) as { events?: IncomingLogEvent[] };
	} catch {
		return json({ ok: false, error: 'invalid-json' }, { status: 400 });
	}

	const events = Array.isArray(payload.events) ? payload.events : [];
	const accepted = events
		.filter((event) => event && typeof event.message === 'string')
		.slice(0, 50)
		.map((event) => ({
			at: typeof event.at === 'string' ? event.at : new Date().toISOString(),
			level: event.level === 'warn' || event.level === 'error' ? event.level : 'info',
			message: event.message as string,
			context: event.context
		}));

	const clientAddress = getClientAddress();
	for (const event of accepted) {
		if (!dev && event.level === 'info') {
			continue;
		}

		const line = `[client-log][${event.level}] ${event.at} ${event.message}`;
		if (event.level === 'error') {
			console.error(line, { ip: clientAddress, context: event.context });
		} else if (event.level === 'warn') {
			console.warn(line, { ip: clientAddress, context: event.context });
		} else {
			console.info(line, { ip: clientAddress, context: event.context });
		}
	}

	return json({ ok: true, received: accepted.length });
};
