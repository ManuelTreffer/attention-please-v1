// src/firebase.ts
import { firebaseConfig } from "./firebaseConfig";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set } from "firebase/database";

// Initialize Firebase
const app = initializeApp(firebaseConfig.firebase);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);

export const getCurrentUserByDeviceId = async (deviceId: string) => {
  const userRef = ref(database, `users/${deviceId}`);
  const snapshot = await get(userRef);
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    return null;
  }
};

export const increaseAttentionCount = async (userId: string, friendId: string) => {
    const friendRef = ref(database, `users/${friendId}/friends/${userId}`);
    // set the attentionCount of friendRef += 1
    const snapshot = await get(friendRef);
    if (snapshot.exists()) {
        const currentAttentionCount = snapshot.val().attentionCount;
        await set(friendRef, { attentionCount: currentAttentionCount + 1 });
    }
}