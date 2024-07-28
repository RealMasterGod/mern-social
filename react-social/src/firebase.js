// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDBOUwjGTq41d2_X9ifCp1E8iliBMCTfAw",
  authDomain: "old-social-media.firebaseapp.com",
  projectId: "old-social-media",
  storageBucket: "old-social-media.appspot.com",
  messagingSenderId: "506960430824",
  appId: "1:506960430824:web:2ac071b398b1a0b4922b5d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;