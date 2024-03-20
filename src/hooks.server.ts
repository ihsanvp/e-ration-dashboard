import { getFirebaseAdminAuth } from '$lib/firebase/firebase.admin';
import { redirect } from '@sveltejs/kit';
import { PUBLIC_ROUTES, AUTH_COOKIE_NAME } from '$lib/constants';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	if (!PUBLIC_ROUTES.includes(event.url.pathname)) {
		const uid = event.cookies.get(AUTH_COOKIE_NAME);

		if (!uid) {
			throw redirect(307, '/login');
		}

		const auth = getFirebaseAdminAuth();
		const user = await auth.getUser(uid);

		event.locals.user = {
			uid,
			email: user.email!
		};
	}

	const response = await resolve(event);
	return response;
}
