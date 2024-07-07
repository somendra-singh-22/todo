import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD7ujy7M7gaUbOW0qDuFh_3d_FcmaeENp8",
  authDomain: "somendra-todo.firebaseapp.com",
  projectId: "somendra-todo",
  storageBucket: "somendra-todo.appspot.com",
  messagingSenderId: "105421217110",
  appId: "1:105421217110:web:006954b3cf5c283f398af7",
  measurementId: "G-6CSW5W6YH6"

};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);