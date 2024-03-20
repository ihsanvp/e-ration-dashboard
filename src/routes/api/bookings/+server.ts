import { json, text } from '@sveltejs/kit';
import { z } from 'zod';
import { AUTH_COOKIE_NAME, AUTH_COOKIE_OPTIONS } from '$lib/constants.js';
import { getFirebaseAdminApp, getFirebaseAdminAuth } from '$lib/firebase/firebase.admin';
import { collection, getDocs } from 'firebase/firestore';
import { getFirestoreApp } from '$lib/firebase/firestore.client';
import type { Booking, BookingPopulated } from '$lib/models/bookings.models';

// const schema = z.object({
// 	uid: z.string()
// });

/** @type {import('./$types').RequestHandler} */
export async function GET() {
	const firestore = getFirestoreApp();
	const auth = getFirebaseAdminAuth();
	const profiles = (await getDocs(collection(firestore, 'profiles'))).docs.map((doc) => ({
		...doc.data(),
		id: doc.id
	}));
	const users = (await auth.listUsers()).users.map((user) => ({
		uid: user.uid,
		phoneNumber: user.phoneNumber,
		profile: profiles.find((profile) => profile.id == user.uid)
	}));
	const items = (await getDocs(collection(firestore, 'items'))).docs.map((doc) => ({
		...doc.data(),
		id: doc.id
	}));
	const bookings = (await getDocs(collection(getFirestoreApp(), 'bookings'))).docs.map((doc) => ({
		...doc.data(),
		id: doc.id
	})) as Booking[];
	return json(
		bookings.map((booking) => ({
			...booking,
			user: users.find((user) => user.uid == booking.user),
			items: booking.items.map((id) => items.find((item) => item.id == id)),
			timestamp: booking.timestamp.toMillis()
		}))
	);
}
