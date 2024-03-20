export const PUBLIC_ROUTES = ['/api/login', '/login', '/logout'];
export const AUTH_COOKIE_NAME = 'e__ses';
export const AUTH_COOKIE_OPTIONS = {
	path: '/',
	httpOnly: true,
	sameSite: 'strict' as boolean | 'strict' | 'lax' | 'none' | undefined,
	secure: true,
	maxAge: 60 * 60 * 24 * 7 // 7 days
};
