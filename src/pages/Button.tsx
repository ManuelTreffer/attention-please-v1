// Button.tsx
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
  IonToast
} from '@ionic/react';
import DisplayUsername from '../components/DisplayUsername';
import './Button.css';
import { database, getCurrentUserByDeviceId, increaseAttentionCount } from '../database/firebase';
import { ref, set, child, get, getDatabase } from "firebase/database";
import { Device } from '@capacitor/device';
import { useHistory } from 'react-router-dom';

interface User {
  username: string;
  friends: any;
}

const Button: React.FC = () => {
  const [showToast, setShowToast] = useState(false);
  //const username = "Hier wird ein Username platziert"
  const [user, setUser] = useState(null);
  const history = useHistory();

  const handleAttentionButtonClick = () => {
    increaseAttentionCounts();
    setShowToast(true);
  };

  const handleFriendsButtonClick = () => {
    history.push('/contact');
  };

  const retrieveUser = async () => {
    const device = await Device.getId();
    const user = await getCurrentUserByDeviceId(device.identifier);
    if (user) {
      setUser(user);
    }
  };

  const increaseAttentionCounts = async () => {
    const device = await Device.getId();
    if (user && user.friends) {
      Object.keys(user.friends).forEach((friendId) => {
        console.log(device.identifier, friendId)
        increaseAttentionCount(device.identifier, friendId);
      });
    }
  }

  useEffect(() => {
    retrieveUser();
  }, []);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Button</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow className='ion-jsutify-content-center ion-align-items-center'>
            <IonCol className="username">
              <DisplayUsername username={user ? user.username : ""} />
            </IonCol>
          </IonRow>
          <IonRow className="ion-justify-content-center ion-align-items-center">
            <IonCol size="auto" className='center'>
              <IonButton className="attention-button" shape="round" onClick={handleAttentionButtonClick}>
                ATTENTION
              </IonButton>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol className="ion-text-end">
              <IonButton className="friends-button" onClick={handleFriendsButtonClick}>
                Friends
              </IonButton>
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

export default Button;
