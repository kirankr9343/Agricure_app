// In src/lib/firebaseAdmin.ts

import admin from 'firebase-admin';

// This line loads the key file you just downloaded
const serviceAccount = require('../../firebase-admin-sdk.json');

// This checks if the connection is already open so it doesn't crash
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

// These are shortcuts so we can easily use Auth and Firestore
export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
export default admin;