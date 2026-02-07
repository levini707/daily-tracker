import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAzrqbqc9BsIzzn5e_9ewS1Ji7r4BBzV7w",
  authDomain: "daily-tracker-abd4f.firebaseapp.com",
  projectId: "daily-tracker-abd4f",
  storageBucket: "daily-tracker-abd4f.firebasestorage.app",
  messagingSenderId: "818106842625",
  appId: "1:818106842625:web:7f6eb24d33465cad930a00",
  measurementId: "G-5K3N55RRBC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export configured instances
export const auth = getAuth(app);
export const db = getFirestore(app);