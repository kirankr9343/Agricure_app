// In src/firebase/firebase.ts

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Go to your Firebase Project Settings (Gear icon) > General tab
// Find and copy your "Web app" config here
const firebaseConfig = {
  apiKey: "AIzaSyDpU5-6eon5ELMQLGrxrQYWuZgX4CIP950",
  authDomain: "studio-2719936959-ff34e.firebaseapp.com",
  projectId: "studio-2719936959-ff34e",
  storageBucket: "studio-2719936959-ff34e.firebasestorage.app",
  messagingSenderId: "704848722652",
  appId: "1:704848722652:web:5d9c35ec5e9936064e5219"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// This line makes 'app' available for other files to import
export { app, auth, db };