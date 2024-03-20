import type { Timestamp } from 'firebase/firestore';
import type { User } from './auth.models';
import type { Item } from './items.models';

export interface Booking {
	id: string;
	user: string;
	items: string[];
	timestamp: Timestamp;
}

export interface BookingPopulated {
	id: string;
	user: User;
	items: Item[];
	timestamp: number;
}
