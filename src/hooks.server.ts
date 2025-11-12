import type { Handle } from '@sveltejs/kit';
import { validateSession } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
	// Get session token from cookie
	const sessionToken = event.cookies.get('session_token');

	if (sessionToken) {
		// Validate session and attach user to locals
		event.locals.user = await validateSession(sessionToken);
	} else {
		event.locals.user = null;
	}

	return resolve(event);
};
