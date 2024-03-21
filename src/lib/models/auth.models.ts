import type { Allocation } from './allocations.data';

export interface AdminUser {
	uid: string;
	email: string;
}

export interface User {
	uid: string;
	phoneNumber: string;
	profile?: UserProfile;
}

export interface UserWithAllocation extends User {
	allocation: Allocation;
	bookings_count: number;
}

export interface UserProfile {
	id: string;
	name: string;
	dob: string;
	address: string;
}
