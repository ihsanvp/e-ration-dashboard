import { text } from '@sveltejs/kit';
import { z } from 'zod';
import { AUTH_COOKIE_NAME, AUTH_COOKIE_OPTIONS } from '$lib/constants.js';

const schema = z.object({
	uid: z.string()
});

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, cookies }) {
	const body = await request.json();
	const data = await schema.parseAsync(body);

	cookies.set(AUTH_COOKIE_NAME, data.uid, AUTH_COOKIE_OPTIONS);

	return text('Logged In.');
}
