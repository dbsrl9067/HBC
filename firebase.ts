import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAgs8tKVhz2n3_Zp78ST9E881uWnnUsJ9k",
  authDomain: "gen-lang-client-0926456275.firebaseapp.com",
  projectId: "gen-lang-client-0926456275",
  storageBucket: "gen-lang-client-0926456275.firebasestorage.app",
  messagingSenderId: "1086476485627",
  appId: "1:1086476485627:web:6273a8142ba3da1827015e"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);