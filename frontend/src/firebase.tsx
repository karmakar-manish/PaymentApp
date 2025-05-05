import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAeul9mURL5WMaLz9FFcei6Gzmkjnojpxg",
    authDomain: "paymentapp-29f65.firebaseapp.com",
    projectId: "paymentapp-29f65",
    storageBucket: "paymentapp-29f65.firebasestorage.app",
    messagingSenderId: "955543333879",
    appId: "1:955543333879:web:684505cc00b20b02c01cf2"
  };

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export {auth, provider}