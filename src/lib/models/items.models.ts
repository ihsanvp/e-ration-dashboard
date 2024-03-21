import type { Timestamp } from 'firebase/firestore';

export interface Item {
	id: string;
	name: string;
	max_quantity: number;
	unit: string;
	timestamp: Timestamp;
}

export type ItemData = Omit<Item, 'id' | 'timestamp'>;
