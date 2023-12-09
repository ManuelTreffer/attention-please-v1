import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import React, { useEffect, useState } from 'react';
import { Device } from '@capacitor/device';
import { database, getCurrentUserByDeviceId } from "./database/firebase"

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

  const [isRegistered, setIsRegistered] = useState<boolean>(false);

  const checkUserExists = async () => {
    const device = await Device.getId();
    const user = await getCurrentUserByDeviceId(device.identifier);
    setIsRegistered(true);
  };

  useEffect(() => {
    checkUserExists();
  }, [isRegistered]);
  
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
  </IonApp>
)};
export default App;
