
import { initializeApp } from "firebase/app";


const firebaseConfig = {
  apiKey: "AIzaSyCacycfh6wuoJ2xoWgh-Maw9jNGFaUXBTo",
  authDomain: "dating-app-28b25.firebaseapp.com",
  projectId: "dating-app-28b25",
  storageBucket: "dating-app-28b25.appspot.com",
  messagingSenderId: "68666045580",
  appId: "1:68666045580:web:98a4a360dc062e673db7a9",
  measurementId: "G-1V1WJ2YW93"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export{app};