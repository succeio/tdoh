import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAQX5g53jQKZzmbSH437w0Vf8sPvxagOb0",
  authDomain: "hiki-b3ad5.firebaseapp.com",
  databaseURL: "https://hiki-b3ad5-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "hiki-b3ad5",
  storageBucket: "hiki-b3ad5.appspot.com",
  messagingSenderId: "279434190282",
  appId: "1:279434190282:web:25d20c8b5f826ac6750333",
  measurementId: "G-LJFJE29SVK"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };