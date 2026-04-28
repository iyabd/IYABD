import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../../firebase-applet-config.json';

const config = firebaseConfig as Record<string, string>;
const app = initializeApp(config);
export const db = getFirestore(app, config['firestoreDatabaseId'] || '(default)');
export const auth = getAuth(app);
