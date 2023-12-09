// src/firebase.ts
import { firebaseConfig } from "./firebaseConfig";
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Initialize Firebase
const app = initializeApp(firebaseConfig.firebase);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);