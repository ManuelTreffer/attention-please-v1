// src/firebase.ts
import { firebaseConfig } from "./firebaseConfig";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";
import { getDatabase, ref, get, set, DataSnapshot, orderByChild, query, equalTo } from "firebase/database";

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
    const userRef = ref(database, `users/${userId}/friends`);

    // Fetch the friend IDs
    const friendIdsSnapshot = await get(userRef);
    const friendIds = friendIdsSnapshot.val();

    if (!friendIds) {
      return [];
    }

    // Fetch usernames of each friend
    const promises = Object.keys(friendIds).map(async (friendId) => {
      const friendRef = ref(database, `users/${friendId}`);
      const friendSnapshot = await get(friendRef);
      const friendData = friendSnapshot.val();

      return {
        id: friendId,
        username: friendData.username,
        attentionCount: friendIds[friendId].attentionCount
      };
    });

    // Resolve all promises and return friend data
    return await Promise.all(promises);
  } catch (error) {
    console.error('Error fetching friend list:', error);
    throw error;
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
        await addFriendById(friendId, userId);
        await addFriendById(userId, friendId);
    }
}

export const addFriendById = async (userId: string, friendId: string) => {
    const friendRef = ref(database, `users/${userId}/friends`);
    const snapshot = await get(friendRef);
    if (snapshot.exists()) {
        const friends = snapshot.val();
        console.log(friends);
        await set(friendRef, { ...friends, [friendId]: { attentionCount: 0 } });
    } else {
        const userRef = ref(database, `users/${userId}`);
        const userSnapshot = await get(userRef);
        if (userSnapshot.exists()) {
            const currentUser = userSnapshot.val();
            console.log("currentuser:", currentUser)
            await set(userRef, { ...currentUser, friends: { [friendId]: { attentionCount: 0 } } });
        }
    }
}
