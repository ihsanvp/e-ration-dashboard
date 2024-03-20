import { text } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ cookies }) {
	cookies.delete(AUTH_COOKIE_NAME, AUTH_COOKIE_OPTIONS);
	return text('Logged out.');
}
