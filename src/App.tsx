import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact, IonToast, IonSpinner } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import React, { useEffect, useState } from 'react';
import { Device } from '@capacitor/device';
import { database, getCurrentUserByDeviceId } from "./database/firebase"
import { ref, onValue } from "firebase/database";
import { SplashScreen } from '@capacitor/splash-screen';
import { PushNotifications } from '@capacitor/push-notifications';

import Home from './pages/Home';
import Button from './pages/Button';
import Contact from './pages/Contact';
import Register from './pages/Register';


/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => {

  const [isRegistered, setIsRegistered] = useState<boolean | null>(null);
  const [showToastAttention, setShowToastAttention] = useState<boolean>(false);
  const [deviceIdentifier, setDeviceIdentifier] = useState<string>("");
  
  const checkUserExists = async () => {
    const device = await Device.getId();
    setDeviceIdentifier(device.identifier);
    const user = await getCurrentUserByDeviceId(device.identifier);

    if (user) {
      setIsRegistered(true);
    } else {
      setIsRegistered(false);
    }
    SplashScreen.hide()
  };

  useEffect(() => {
    registerNotifications();
    addListeners();
    checkUserExists();
  }, []);

  useEffect(() => {
    console.log("add")
      if (deviceIdentifier) {
        // Get a reference to the friend's attention count
        const friendsRef = ref(database, `users/${deviceIdentifier}/friends`);
        
        // Listen for changes to the attention count
        onValue(friendsRef, (snapshot) => {
          const friendIds = snapshot.val();
          console.log("friends changed!")
          setShowToastAttention(true)
          
          
          // // Trigger a browser notification
          // if (Notification.permission === "granted") {
          //   console.log("test")
          //   new Notification(`Hey! One of your friends wants your attention!`);
          // } else if (Notification.permission !== "denied") {
          //   Notification.requestPermission().then(permission => {
          //     if (permission === "granted") {
          //       new Notification(`Hey! One of your friends wants your attention!`);
          //     }
          //   });
          // }
        });

      }

  }, [deviceIdentifier]);

  const addListeners = async () => {
    await PushNotifications.addListener('registration', token => {
      console.info('Registration token: ', token.value);
    });
  
    await PushNotifications.addListener('registrationError', err => {
      console.error('Registration error: ', err.error);
    });
  
    await PushNotifications.addListener('pushNotificationReceived', notification => {
      console.log('Push notification received: ', notification);
    });
  
    await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
      console.log('Push notification action performed', notification.actionId, notification.inputValue);
    });
  }

  const registerNotifications = async () => {
    let permStatus = await PushNotifications.checkPermissions();
  
    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }
  
    if (permStatus.receive !== 'granted') {
      throw new Error('User denied permissions!');
    }
  
    await PushNotifications.register();
  }

  


  if (isRegistered === null) {
    return (
      <IonApp>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
              <IonSpinner></IonSpinner>
            </div>
      </IonApp>
    );
  }
  
  return (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/">
          {isRegistered ? <Redirect to="/button" /> : <Redirect to="/register" />}
        </Route>
        <Route exact path="/button">
          <Button />
        </Route>
        <Route exact path="/contact">
          <Contact />
        </Route>
        <Route exact path="/register">
          <Register />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
    <IonToast
        isOpen={showToastAttention}
        onDidDismiss={() => setShowToastAttention(false)}
        message={`Hey! Your friends want your attention!`}
        duration={2000}
      />
  </IonApp>
)};
export default App;

