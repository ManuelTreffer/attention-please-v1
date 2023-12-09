import React, { useEffect } from 'react';
import { getToken } from 'firebase/messaging';
import { messaging } from '../database/firebase';
import { IonLabel } from "@ionic/react";

const ReceiveToken: React.FC = () => {
    useEffect(() => {
        const getFCMToken = async () => {
            try {
                const token = await getToken(messaging);
                console.log('FCM-Token: ', token);
            } catch (error) {
                console.error('Fehler beim Abrufen des FCM-Tokens: ', error);
            }
        };
        
        getFCMToken();
    }, []);

    return (
        <IonLabel className="ion-text-center">
            Token
        </IonLabel>
    );

};