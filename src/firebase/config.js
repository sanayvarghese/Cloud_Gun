import firebase from "firebase";
import "firebase/storage";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDCRqheHO8m8NABk9riOyL2vR6mU_VXd6Y",
  authDomain: "cloud-b0b6c.firebaseapp.com",
  projectId: "cloud-b0b6c",
  storageBucket: "cloud-b0b6c.appspot.com",
  messagingSenderId: "415599011836",
  appId: "1:415599011836:web:606c28c23209df16557479",
  measurementId: "G-HEWXK7J6LY",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

const projectStorage = app.storage();
const auth = app.auth();
const projectFirestore = app.firestore();
const timestamp = firebase.firestore.FieldValue.serverTimestamp;
export const db = app.firestore();
export { projectStorage, projectFirestore, timestamp, auth };
