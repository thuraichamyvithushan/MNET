import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyBAgNo62ei5hm3gX8e4465k4cEgaShnAnU",
  authDomain: "mototrekkin-internal.firebaseapp.com",
  projectId: "mototrekkin-internal",
  storageBucket: "mototrekkin-internal.firebasestorage.app",
  messagingSenderId: "104239886450",
  appId: "1:104239886450:web:5f26fb4add7a3c9fdb92eb"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const firestore = firebase.firestore();
export const auth = firebase.auth();
export default firebase;