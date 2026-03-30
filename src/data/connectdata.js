

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";        
import { collection, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCk_SDqp8k6jrJTSUuYe4_ro4QP-EPiG3U",
  authDomain: "coffeeshopdb-88237.firebaseapp.com",
  projectId: "coffeeshopdb-88237",
  storageBucket: "coffeeshopdb-88237.firebasestorage.app",
  messagingSenderId: "840057690760",
  appId: "1:840057690760:web:4653b8bbc1fcae7701dd3d",
  measurementId: "G-5L6ZZYHPS7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);        
          
export const dulieu = getFirestore(app);

const secondaryApp = initializeApp(firebaseConfig, "Secondary"); 
export const secondaryAuth = getAuth(secondaryApp);

export const productsCollection = collection(dulieu, "products");
export const staffsCollection = collection(dulieu, "staffs");
export const usersCollection = collection(dulieu, "users");
export const categoriesCollection = collection(dulieu, "categories");
