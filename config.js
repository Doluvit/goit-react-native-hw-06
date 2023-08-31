// Для роботи із firebase обовʼязково треба ініціалізувати проект
import { initializeApp } from "firebase/app";
// Функція для підключення авторизації в проект
import { getAuth } from "firebase/auth";
// Функція для підключення бази даних у проект
import { getFirestore } from "firebase/firestore";
// Функція для підключення сховища файлів в проект
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDVeGYXoqi-EV0H6lwY3f3dbkgtONHhclo",
  authDomain: "goit-react-native-394115.firebaseapp.com",
  databaseURL: "https://goit-react-native-394115-default-rtdb.firebaseio.com",
  projectId: "goit-react-native-394115",
  storageBucket: "goit-react-native-394115.appspot.com",
  messagingSenderId: "35610638866",
  appId: "1:35610638866:web:0294c56526832b759836cb",
  measurementId: "G-Z5NN27LXRJ",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
