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
  IonToast
} from '@ionic/react';
import { addCircleOutline } from 'ionicons/icons';
import './Contact.css'; // Updated CSS file name
import { getFriendsList, addFriend, getCurrentUserByDeviceId } from '../database/firebase';
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
  const [showToast, setShowToast] = useState(false);
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
      addFriend(userId, friendName);
      setFriendName('');
      setShowToast(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Kontakte</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <div className="username-display">
          <IonAvatar className="user-avatar">
            <img src="https://ionicframework.com/docs/img/demos/avatar.svg" alt="User avatar" />
          </IonAvatar>
          <h2>{user?.username}</h2>
        </div>
        <IonList>
          {friendsList.map((friend, index) => (
            <IonItem key={index}>
              <IonAvatar slot="start">
                <img src="https://ionicframework.com/docs/img/demos/avatar.svg" alt="Friend avatar" />
              </IonAvatar>
              <IonLabel className="ion-padding-start">{friend.username}</IonLabel>
              <IonLabel slot="end" className="attention-count">{friend.attentionCount}</IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
      <IonFooter>
        <IonItem lines="none">
          <IonInput className="input-friend-name" placeholder="user_456" value={friendName} onIonChange={e => setFriendName(e.detail.value)} />
          <IonButton fill="clear" onClick={addFriendHandler}>
            <IonIcon slot="icon-only" icon={addCircleOutline} />
          </IonButton>
        </IonItem>
      </IonFooter>
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message="Friend added successfully."
        duration={2000}
      />
    </IonPage>
  );
};

export default Contact;