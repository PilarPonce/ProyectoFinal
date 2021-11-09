import app from 'firebase/app';
import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyAyU5YuQJWDFZnL_Bi5rwYM9LoHX8PPDnM",
    authDomain: "proyectointegrador-f83f9.firebaseapp.com",
    projectId: "proyectointegrador-f83f9",
    storageBucket: "proyectointegrador-f83f9.appspot.com",
    messagingSenderId: "735326212783",
    appId: "1:735326212783:web:f953337cd6824351dffa5a"
};


app.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const storage = app.storage();
export const db = app.firestore();