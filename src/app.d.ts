// See https://kit.svelte.dev/docs/types#app

import type { AdminUser } from '$lib/models/auth.models';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: AdminUser;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
