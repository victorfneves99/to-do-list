// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6ZgqEEgHJ-0_4fTA4NDmddLIxxQOKamw",
  authDomain: "tarefasplus-b291b.firebaseapp.com",
  projectId: "tarefasplus-b291b",
  storageBucket: "tarefasplus-b291b.appspot.com",
  messagingSenderId: "966588734083",
  appId: "1:966588734083:web:bef43b72419f3d685219b6",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore();

export { db };
