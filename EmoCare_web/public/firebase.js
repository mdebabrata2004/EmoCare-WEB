// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDp5VCxJH7DJKWafMtJ41G9HbNqQntI11I",
  authDomain: "emocare-web.firebaseapp.com",
  projectId: "emocare-web",
  storageBucket: "emocare-web.firebasestorage.app",
  messagingSenderId: "436542177453",
  appId: "1:436542177453:web:dd39352920c271de2b4624",
  measurementId: "G-TT33Y8EJXM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);