import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCaAyPrzkGiiHd7Ex4SE_erWRdOy8oH5bI",
  authDomain: "mixtape-91907.firebaseapp.com",
  projectId: "mixtape-91907",
  storageBucket: "mixtape-91907.firebasestorage.app",
  messagingSenderId: "472506368835",
  appId: "1:472506368835:web:18896db041834702d965f6"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
