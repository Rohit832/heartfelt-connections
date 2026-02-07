import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCkp_H27_RjLYlotg6ci08Z765tSWhNZDA",
    authDomain: "bloodtest-96ed5.firebaseapp.com",
    projectId: "bloodtest-96ed5",
    storageBucket: "bloodtest-96ed5.firebasestorage.app",
    messagingSenderId: "977400672295",
    appId: "1:977400672295:web:346577d6b3196585cd5e02",
    measurementId: "G-KWNKYJFFN6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
