// Contact.tsx
import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonToast,
  IonList,
  IonItem,
  IonLabel,
  IonInput
} from '@ionic/react';
import DisplayUsername from '../components/DisplayUsername';
import './Button.css';
import { database } from '../database/firebase';
import { ref, set, child, get, getDatabase } from "firebase/database";
import { getFriendsList, addFriend, getCurrentUserByDeviceId } from '../database/firebase';
import { Device } from '@capacitor/device';


const Contact: React.FC = () => {
  const [showToast, setShowToast] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const [friendsList, setFriendsList] = useState<any[]>([]);
  const [friendName, setFriendName] = useState<string>('');
  const [user, setUser] = useState(null);

  const handleButtonClick = () => {
    setShowToast(true);
  };

  useEffect(() => {
    retrieveUser();
  }, [userId]);
  
  const retrieveUser = async () => {
    const device = await Device.getId();
    const user = await getCurrentUserByDeviceId(device.identifier);
    if (user) {
      setUserId(device.identifier);
      getFriends();
    }
  };

  const getFriends = async () => {
    try {
        const friends = await getFriendsList(userId);
        console.log("Friends")
        console.log(friends);
        setFriendsList(Object.entries(friends[0]).map(([key, value]) => ({
            key,
            attentionCount: value?.attentionCount || 0, })));
    } catch (error) {
        console.error("Fehler beim Laden der Freundesliste: ", error);
    }
  };

  const searchUsers = async () => {
    try {
       // const results = await searchUsersInDatabase(searchTerm);
        //setSearchResults(results);
    } catch (error) {
        console.error('Fehler beim Suchen von Benutzern:', error);
      }
  };

  const addFriendHandler = async () => {
    addFriend(userId, friendName);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Kontakt</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow className='ion-jsutify-content-center ion-align-items-center'>
            <DisplayUsername username={userId} />
            <IonCol className="username">
              Deine Kontakte
            </IonCol>
          </IonRow>
          <IonRow className="ion-justify-content-center ion-align-items-center">
            <IonCol size="auto" className="friend-list">
              <IonList>
                {friendsList.map((friend, index) => (
                    <IonItem key={index}>
                        <IonLabel>{friend.key}</IonLabel>
                        <IonLabel slot="end">{friend.attentionCount}</IonLabel>
                    </IonItem>
                ))}
              </IonList>
            </IonCol>
          </IonRow>
          <IonRow className="ion-justify-content-center ion-align-items-center">
            <IonCol size="auto" className='center'>
              <IonItem>
                <IonInput placeholder="Enter a name" value={friendName} onIonChange={e => setFriendName(e.detail.value)}></IonInput>
                <IonButton onClick={addFriendHandler}>Add</IonButton>
              </IonItem>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Hier bekommst du deine Aufmerksamkeit."
          duration={2000}
        />
      </IonContent>
    </IonPage>
  );
};

export default Contact;
