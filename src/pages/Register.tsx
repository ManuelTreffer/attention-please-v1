import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/react';
import './Register.css';
import { database, getCurrentUserByDeviceId } from "../database/firebase"
import { getDatabase, ref, set, runTransaction} from "firebase/database";
import { useHistory } from 'react-router-dom';
import { Device } from '@capacitor/device';

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const history = useHistory();


  const checkUserExists = async () => {
    const device = await Device.getId();
    const user = await getCurrentUserByDeviceId(device.identifier);
    console.log(user)
    if (user !== null) {
      history.push('/button');
    }
  };

  useEffect(() => {
    checkUserExists();
  }, []);

  const generateUsername = () => {
    // Generate random username logic here
    const randomNumber = Math.floor(Math.random() * 1000);
    const randomUsername = `user_${randomNumber}`;
    setUsername(randomUsername);
  };

  const registerUser = async () => {
    const device = await Device.getId();
    var userRef = ref(database, ('users/' + device.identifier));

    // Use the transaction to check if the user already exists
    try {
      runTransaction(
        userRef,
        function(currentData: any) {
            if (currentData === null) {
                // If the user doesn't exist, create a new user with the specified ID
                return {
                    username: username,
                    friends: {}
                };
            } else {
                // User already exists, abort the transaction
                return; // undefined
            }
        }
      );
      history.push('/button');
      console.log("Transaction successfully committed!");
    } catch (e) {
      console.log("Transaction failed: ", e);
    }
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Register</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="center">
          <h1>Generate a random username:</h1>
          <div className="username-wrapper">
            <h2>{username}</h2>
          </div>
          <IonButton onClick={generateUsername}>Generate Username</IonButton>
        </div>
      </IonContent>
      <IonButton expand="full" onClick={registerUser} disabled={!username}>
          Register
      </IonButton>
    </IonPage>
  );
};

export default Register;
