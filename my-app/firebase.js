// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAXL8fyYIvNZc2DOPaZ8aoh_l-09eUghxU",
  authDomain: "inventory-control-5ed36.firebaseapp.com",
  projectId: "inventory-control-5ed36",
  storageBucket: "inventory-control-5ed36.appspot.com",
  messagingSenderId: "434749194517",
  appId: "1:434749194517:web:8c52c76e4bdddcaa90e91c",
  measurementId: "G-HK5QDXVTE9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)

export {firestore}