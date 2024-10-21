import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDI8O4TAHsGtGI6rEMLSJTnBVzDzclLTWg",
  authDomain: "brds-2e65a.firebaseapp.com",
  databaseURL: "https://brds-2e65a-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "brds-2e65a",
  storageBucket: "brds-2e65a.appspot.com",
  messagingSenderId: "253643735901",
  appId: "1:253643735901:web:9498693474d411bc501eb4"
};

// Инициализация приложения Firebase
const app = initializeApp(firebaseConfig);

// Инициализация Realtime Database
const database = getDatabase(app);

// Инициализация Firebase Storage
const storage = getStorage(app);

export { database, storage };
