export interface Item {
	id: string;
	name: string;
	max_quantity: number;
	unit: string;
}

export type ItemData = Omit<Item, 'id'>;
