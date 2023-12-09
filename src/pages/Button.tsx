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
import ExploreContainer from '../components/ExploreContainer';
import './Button.css';

const Button: React.FC = () => {
  const [showToast, setShowToast] = useState(false);

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
          <IonRow className="ion-justify-content-center ion-align-items-center">
            <IonCol size="auto">
              <IonButton shape="round" onClick={handleButtonClick}>
                ATTENTION, PLEASE!
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
