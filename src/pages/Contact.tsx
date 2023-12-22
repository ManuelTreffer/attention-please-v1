// Contact.tsx
import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonFooter,
  IonIcon,
  IonAvatar,
  IonToast,
  IonFabButton,
  IonBackButton,
  IonButtons,
  useIonToast,
  IonItemSliding,
  IonItemOptions,
  IonItemOption
} from '@ionic/react';
import { addCircleOutline, add, arrowBack, trash, arrowUndo } from 'ionicons/icons';
import './Contact.css'; // Updated CSS file name
import { getFriendsList, getFriendsListFromIds, addFriend, getCurrentUserByDeviceId, database } from '../database/firebase';
import { ref, onValue } from "firebase/database";

import { Device } from '@capacitor/device';

interface User {
  username: string;
  friends: any;
}

interface Friend {
  username: string;
  attentionCount: number;
}

const Contact: React.FC = () => {

  const [present] = useIonToast();

  const presentToast = (message: string, position: 'top' | 'middle' | 'bottom' = 'top') => {
    present({
      message: message,
      duration: 2000,
      position: position,
    });
  };

  const [showToastSuccess, setShowToastSuccess] = useState(false);
  const [showToastUserNotExists, setShowToastUserNotExists] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const [friendsList, setFriendsList] = useState<Friend[]>([]);
  const [friendName, setFriendName] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const retrieveUser = async () => {
      const device = await Device.getId();
      const user = await getCurrentUserByDeviceId(device.identifier);
      if (user) {
        setUser(user);
        setUserId(device.identifier);
        getFriends(device.identifier);

        // Get a reference to the friend's attention count
        const friendAttentionRef = ref(database, `users/${device.identifier}/friends`);

        // Listen for changes to the attention count
        onValue(friendAttentionRef, async (snapshot) => {
          const friendIds = snapshot.val();
          console.log(`Friends changed`);
          const friends = await getFriendsListFromIds(friendIds)
          setFriendsList(friends);
        });
      }
    };
    retrieveUser();
  }, []);

  const getFriends = async (userId: string) => {
    try {
      const friends = await getFriendsList(userId);
      setFriendsList(friends);
    } catch (error) {
      console.error("Error loading friend list: ", error);
    }
  };

  const addFriendHandler = async () => {
    if (friendName) {
      let success = await addFriend(userId, friendName);
      if (success) {
        //setShowToastSuccess(true);
        setFriendName(friendName);
        getFriends(userId);
        presentToast(`User '${friendName}' added as friend successfully.`)
      } else {
        //setShowToastUserNotExists(true);
        presentToast(`User '${friendName}' does not exist.`, "bottom")
      }
    }
  };

  const handleReset = (index, e) => {
    const updatedFriendsList = [...friendsList];
    updatedFriendsList[index].attentionCount = 0;
    setFriendsList(updatedFriendsList);
    e.close()
  };
  
  const handleDelete = (index, e) => {
    const updatedFriendsList = [...friendsList];
    updatedFriendsList.splice(index, 1);
    setFriendsList(updatedFriendsList);
    e.close()
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="toolbar">
          <IonButtons slot="start">
            <IonBackButton></IonBackButton>
          </IonButtons>
          <IonTitle>Kontakte</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding" color="secondary">
        <div className="username-display">
          <IonAvatar className="user-avatar">
            <img src="https://ionicframework.com/docs/img/demos/avatar.svg" alt="User avatar" />
          </IonAvatar>
          <h1>{user?.username}</h1>
        </div>
        <IonList>
          {friendsList.map((friend, index) => (
            <IonItemSliding>
              <IonItem key={index} color="secondary">
                <IonAvatar slot="start">
                  <img src="https://ionicframework.com/docs/img/demos/avatar.svg" alt="Friend avatar" />
                </IonAvatar>
                <IonLabel className="ion-padding-start friends-name" >{friend.username}</IonLabel>
                <IonLabel slot="end" className="label-attention-count">
                  {friend.attentionCount > 0 && <div className="attention-count">{friend.attentionCount}</div>}    
                </IonLabel>
              </IonItem>
              <IonItemOptions>
                <IonItemOption onClick={(e) => handleReset(index, e)}>
                  <IonIcon slot="start" icon={arrowUndo} ></IonIcon>
                  Reset
                </IonItemOption>
                <IonItemOption color="danger" onClick={(e) => handleDelete(index, e)}>
                  <IonIcon slot="start" icon={trash}></IonIcon>
                  Delete
                  </IonItemOption>
              </IonItemOptions>
            </IonItemSliding>
          ))}
        </IonList>
      </IonContent>
      <IonFooter className='footer'>
        <IonItem className='footer-item' lines="none">
          <IonInput className="input-friend-name" placeholder="user_456" value={friendName} onIonChange={e => setFriendName(e.detail.value)} />
          <IonButton className='add-button' onClick={addFriendHandler} size='default'>
            <IonIcon slot="icon-only" icon={add}/>
          </IonButton>
        </IonItem>
      </IonFooter>
      <IonToast
        isOpen={showToastUserNotExists}
        onDidDismiss={() => setShowToastUserNotExists(false)}
        message={`User '${friendName}' does not exist.`}
        duration={2000}
      />
      <IonToast
        isOpen={showToastSuccess}
        onDidDismiss={() => setShowToastSuccess(false)}
        message={`User '${friendName}' added as friend successfully.`}
        duration={2000}
      />
    </IonPage>
  );
};

export default Contact;