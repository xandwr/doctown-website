import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies }) => {
	// Clear session cookie
	cookies.delete('session_token', { path: '/' });

	// Redirect to homepage
	throw redirect(302, '/');
};
