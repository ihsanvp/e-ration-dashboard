import { json, text } from '@sveltejs/kit';
import { z } from 'zod';
import { AUTH_COOKIE_NAME, AUTH_COOKIE_OPTIONS } from '$lib/constants.js';
import { getFirebaseAdminAuth } from '$lib/firebase/firebase.admin.js';
import { Timestamp, collection, getDocs, query, where } from 'firebase/firestore';
import { getFirestoreApp } from '$lib/firebase/firestore.client.js';
import type { Allocation } from '$lib/models/allocations.data.js';
import type { UserProfile } from '$lib/models/auth.models.js';
import type { Item } from '$lib/models/items.models.js';
import { v4 } from 'uuid';
import type { Booking, BookingPopulated } from '$lib/models/bookings.models.js';

// const schema = z.object({
// 	uid: z.string()
// });

function getUserAllocation(uid: string, allocations: Allocation[], items: Item[]): Allocation {
	const allocation = allocations.find((al) => al.user == uid);
	if (allocation) {
		if (allocation.items.length != items.length) {
			allocation.items = items.map((item) => {
				const existingAllocationItem = allocation.items.find((alItem) => alItem.id == item.id);
				if (!existingAllocationItem) {
					return {
						id: item.id,
						name: item.name,
						unit: item.unit,
						quantity: item.max_quantity,
						max_quantity: item.max_quantity
					};
				}
				return existingAllocationItem;
			});
		}
		return allocation;
	}

	return {
		id: v4(),
		user: uid,
		timestamp: Timestamp.fromDate(new Date()),
		items: items.map((item) => ({
			id: item.id,
			name: item.name,
			unit: item.unit,
			quantity: item.max_quantity,
			max_quantity: item.max_quantity
		}))
	};
}

function getUserBookingsCount(uid: string, bookings: BookingPopulated[]): number {
	return bookings.reduce((count, booking) => {
		if (booking.user.uid == uid) {
			return count + 1;
		}
		return count;
	}, 0);
}

/** @type {import('./$types').RequestHandler} */
export async function GET({ cookies }) {
	const db = getFirestoreApp();
	const profiles = (await getDocs(collection(db, 'profiles'))).docs.map((doc) => ({
		...doc.data(),
		id: doc.id
	})) as UserProfile[];
	const allocations = (await getDocs(collection(db, 'allocations'))).docs.map((doc) => ({
		...doc.data(),
		id: doc.id
	})) as Allocation[];
	const items = (await getDocs(collection(db, 'items'))).docs.map((doc) => ({
		...doc.data(),
		id: doc.id
	})) as Item[];
	const bookings = (await getDocs(collection(db, 'bookings'))).docs.map((doc) => ({
		...doc.data(),
		id: doc.id
	})) as BookingPopulated[];
	const auth = getFirebaseAdminAuth();
	const uid = cookies.get(AUTH_COOKIE_NAME);
	const users = (await auth.listUsers()).users
		.filter((user) => user.uid != uid)
		.map((user) => ({
			uid: user.uid,
			phoneNumber: user.phoneNumber,
			profile: profiles.find((profile) => profile.id == user.uid),
			allocation: getUserAllocation(user.uid, allocations, items),
			bookings_count: getUserBookingsCount(user.uid, bookings)
		}));

	return json(users);
}
