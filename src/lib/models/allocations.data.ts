import type { Timestamp } from 'firebase/firestore';

export interface AllocationItem {
	id: string;
	name: string;
	unit: string;
	quantity: number;
	max_quantity: number;
}

export interface Allocation {
	id: string;
	user: string;
	items: AllocationItem[];
	timestamp: Timestamp;
}
