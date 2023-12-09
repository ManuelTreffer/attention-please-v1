// src/firebase.ts
import { firebaseConfig } from "./firebaseConfig";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set, DataSnapshot, orderByChild, query, equalTo } from "firebase/database";

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

export const addFriend = async (userId: string, username: string) => {
    console.log("add Friend: ", userId, username)
    const userFriendsRef = ref(database, `users`);

    const filteredFriendsRef = query(userFriendsRef, orderByChild('username'));
    const filteredFriendsQuery = query(filteredFriendsRef, equalTo(username));
    const snapshot = await get(filteredFriendsQuery);

    if (snapshot.exists()) {
        const user = snapshot.val();
        const friendId = Object.keys(user)[0];
        console.log(friendId)
        addFriendById(friendId, userId);
        addFriendById(userId, friendId);
    }
}

export const addFriendById = async (userId: string, friendId: string) => {
    const friendRef = ref(database, `users/${userId}/friends`);
    // set the attentionCount of friendRef += 1
    const snapshot = await get(friendRef);
    if (snapshot.exists()) {
        const currentUser = snapshot.val();
        console.log(currentUser);
        await set(friendRef, { [friendId]: { attentionCount: 0 }, ...snapshot.val() });
    } else {
        const friendsRef = ref(database, `users/${userId}`);
        const friendsSnapshot = await get(friendsRef);
        if (friendsSnapshot.exists()) {
            const currentUser = friendsSnapshot.val();
            console.log("currentuser:", currentUser)
            await set(friendsRef, {friends: { [friendId]: { attentionCount: 0 }, username: currentUser.username}});
        }
        
    }
}