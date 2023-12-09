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
import { database } from '../database/firebase';
import { ref, set, child, get, getDatabase } from "firebase/database";


const Button: React.FC = () => {
  const [showToast, setShowToast] = useState(false);
  //const username = "Hier wird ein Username platziert"
  const [username, setUsername] = useState('');

  const handleButtonClick = () => {
    setShowToast(true);
  };

  useEffect(() => {
    const dbRef = ref(database);
    get(child(dbRef, 'users')).then((snapshot) => {
      const userData = snapshot.val();
      
      const first_key = Object.keys(userData)[0];
      //console.log(first_key)
      setUsername(first_key);
    });
  }, [username]);

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
              <DisplayUsername username={username} />
            </IonCol>
          </IonRow>
          <IonRow className="ion-justify-content-center ion-align-items-center">
            <IonCol size="auto" className='center'>
              <IonButton className="attention-button" shape="round" onClick={handleButtonClick}>
                ATTENTION
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
