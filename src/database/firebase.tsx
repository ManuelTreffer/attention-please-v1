// src/firebase.ts
import { firebaseConfig } from "./firebaseConfig";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, DataSnapshot } from "firebase/database";

// Initialize Firebase
const app = initializeApp(firebaseConfig.firebase);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);

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
