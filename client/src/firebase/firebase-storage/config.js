// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyACRPxxrqqbp8Pp9EgZZigNj98rED6bKew",
    authDomain: "chime-profile-avatars-database.firebaseapp.com",
    projectId: "chime-profile-avatars-database",
    storageBucket: "chime-profile-avatars-database.firebasestorage.app",
    messagingSenderId: "118171113681",
    appId: "1:118171113681:web:3927ceab4cf0e9e5364df0",
    measurementId: "G-KVSX6YDQY1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);