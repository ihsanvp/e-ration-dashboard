export interface AdminUser {
	uid: string;
	email: string;
}

export interface User {
	uid: string;
	phoneNumber: string;
	profile?: UserProfile;
}

export interface UserProfile {
	id: string;
	name: string;
	dob: string;
	address: string;
}
