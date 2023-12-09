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
  IonLabel
} from '@ionic/react';
import DisplayUsername from '../components/DisplayUsername';
import './Button.css';
import { database } from '../database/firebase';
import { ref, set, child, get, getDatabase } from "firebase/database";
import { getFriendsList } from '../database/firebase';


const Contact: React.FC = () => {
  const [showToast, setShowToast] = useState(false);
  //const username = "Hier wird ein Username platziert"
  const [userId, setUserId] = useState<string>('');
  const [friendsList, setFriendsList] = useState<any[]>([]);

  const handleButtonClick = () => {
    setShowToast(true);
  };


  useEffect(() => {
    setUserId('189ab5ea-c0ca-4364-ac99-68a882e8bfec');

    if (userId){
        getFriends();
    }
  }, [userId]);
  
  const getFriends = async () => {
    try {
        const friends = await getFriendsList(userId);
        console.log("Friends")
        console.log(friends);
        setFriendsList(Object.entries(friends[0]).map(([key, value]) => ({key, ...value})));
    } catch (error) {
        console.error("Fehler beim Laden der Freundesliste: ", error);
    }
  };

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
            <IonCol className="username">
              Deine Kontakte
            </IonCol>
          </IonRow>
          <IonRow className="ion-justify-content-center ion-align-items-center">
            <IonCol size="auto" className='center'>
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
