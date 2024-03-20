import { Firestore, getFirestore } from 'firebase/firestore';
import { getFirebaseApp } from './firebase.client';

let firestore: Firestore | undefined;

export function getFirestoreApp() {
	if (!firestore) {
		firestore = getFirestore(getFirebaseApp());
	}
	return firestore;
}
