import { initializeApp, getApps } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
import firebaseConfig from "./firebaseConfig";

export const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {});
