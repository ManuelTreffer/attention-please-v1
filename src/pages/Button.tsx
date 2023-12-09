// Button.tsx
import React, { useState } from 'react';
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


const Button: React.FC = () => {
  const [showToast, setShowToast] = useState(false);
  const username = "Hier wird ein Username platziert"

  const handleButtonClick = () => {
    setShowToast(true);
  };

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
