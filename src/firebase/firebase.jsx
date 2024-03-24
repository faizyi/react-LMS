import { initializeApp } from "firebase/app";
import { getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword, onAuthStateChanged, signOut,signInAnonymously  } from "firebase/auth";
import { getFirestore,doc,setDoc, getDoc,collection,addDoc,getDocs, query, orderBy, limit,where, } from "firebase/firestore";
import { getStorage,ref, uploadBytes, uploadBytesResumable, getDownloadURL } from "firebase/storage";
const firebaseConfig = {
    apiKey: "AIzaSyCj_p0bqU61pJB0E4V1Ekd4Qc3waV5kg7E",
    authDomain: "lms-web-9a0fc.firebaseapp.com",
    projectId: "lms-web-9a0fc",
    storageBucket: "lms-web-9a0fc.appspot.com",
    messagingSenderId: "548907663691",
    appId: "1:548907663691:web:cd536315c0ba2eab3c28ce",
    measurementId: "G-YKHX5VML8K"
  };
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app)
export{
    auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    doc,
    getDoc,
    db,
    setDoc,
    collection,
    addDoc,
    storage,
    ref,
    uploadBytes,
    uploadBytesResumable,
    getDownloadURL,
    getDocs,
    signInAnonymously,
    query, orderBy, limit,where,
}