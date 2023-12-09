import React from "react";
import { IonLabel } from "@ionic/react";

interface DisplayUsernameProps {
    username: string;
}

const DisplayUsername: React.FC<DisplayUsernameProps> = ({ username }) => {
    return (
        <IonLabel className="ion-text-center">
            User: {username}
        </IonLabel>
    );
};

export default DisplayUsername;