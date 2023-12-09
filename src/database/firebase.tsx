// src/firebase.ts
import { firebaseConfig } from "./firebaseConfig";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set, DataSnapshot } from "firebase/database";
import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";

// Initialize Firebase
const app = initializeApp(firebaseConfig.firebase);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);
export const analytics =  getAnalytics(app);
export const messaging = getMessaging(app);

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
export const getFriendsList = async (userId: string): Promise<any[]> => {
  try {
    const userFriendsRef = ref(database, `users/${userId}`);
    const snapshot = await get(userFriendsRef);

    if (snapshot.exists()) {
      // Umwandlung des Snapshot in ein Array
      const friendsArray: any[] = [];
      snapshot.forEach((childSnapshot: DataSnapshot) => {
        const friendData = childSnapshot.val();
        friendsArray.push(friendData);
      });

      return friendsArray;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Fehler beim Abrufen der Freundesliste:', error);
    return [];
  }
};