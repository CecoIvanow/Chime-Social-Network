import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// This API is made public in order for the firebase image upload to function properly
// It will be regenerated and hidden after Softuni's React.js project defence 

const firebaseConfig = {
    apiKey: "AIzaSyACRPxxrqqbp8Pp9EgZZigNj98rED6bKew",
    authDomain: "chime-profile-avatars-database.firebaseapp.com",
    projectId: "chime-profile-avatars-database",
    storageBucket: "chime-profile-avatars-database.firebasestorage.app",
    messagingSenderId: "118171113681",
    appId: "1:118171113681:web:3927ceab4cf0e9e5364df0",
    measurementId: "G-KVSX6YDQY1"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);