import type { Timestamp } from 'firebase/firestore';
import type { User } from './auth.models';
import type { Item } from './items.models';
import { string } from 'zod';

export interface Booking {
	id: string;
	user: string;
	items: string[];
	timestamp: Timestamp;
}

export interface BookingItem {
	name: string;
	unit: string;
	quantity: number;
}

export interface BookingPopulated {
	id: string;
	user: User;
	items: BookingItem[];
	timestamp: Timestamp;
}
