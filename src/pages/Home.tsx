import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonViewDidLeave } from '@ionic/react';
import { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import AccelerationRecord from '../ble/AccelerationRecord';
import { connectToDevice, subscribeToNotifications, unSubscribeToNotifications } from '../ble/BLEWrapper';
import { shareLocal } from '../share';

const Home: React.FC = () => {

  const [deviceId, setDeviceId] = useState<string>();
  const [deviceName, setDeviceName] = useState<string>();
  const [recording, setRecording] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [accelerations, setAccelerations] = useState(new Array<AccelerationRecord>());

  useEffect(() => {
    connect();
  }, []);

  useIonViewDidLeave(() => {
    unsubscribe();
  });

  const connect = () => {
    connectToDevice()
      .then(device => {
        setDeviceId(device.id);
        setDeviceName(device.name);
      })
      .catch(err => {
        alert("Failed to connect to ble device!");
        console.log("Failed to connect!", err);
        connect();
      });
  }

  const startRecording = () => {
    if (deviceId) {
      subscribeToNotifications(deviceId, dataCallback).catch(err => {
        console.error(`failed to subscribe to '${deviceId}'.`, err);
        setDeviceId(undefined);
      })
      setRecording(true);
      setStartTime(Date.now());
      setAccelerations(new Array<AccelerationRecord>());
    }
  }

  const stopRecording = () => {
    unsubscribe();
    setEndTime(Date.now());
    setRecording(false);
  }

  const share = () => {
    const current_uuid = uuid();
    const shareObject = { "uuid": current_uuid, "deviceId": deviceId, "startTime": startTime, "endTime": endTime, "accelerations": accelerations };
    const fileName = `${current_uuid}.json`;
    const file = new File([JSON.stringify(shareObject)], fileName, { type: "application/json" });
    shareLocal(fileName, file);
  }

  const dataCallback = (accelerationRecord: AccelerationRecord) => {
    console.log(`acceleration:`, accelerationRecord)
    setAccelerations(accelerations => [...accelerations, accelerationRecord]);
  }


  const unsubscribe = () => {
    if (deviceId) {
      unSubscribeToNotifications(deviceId).catch(err => {
        console.error(`failed to unsubscribe from '${deviceId}'.`, err);
      });
    }
  }


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>YBand Recorder</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">YBand Recorder</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div hidden={deviceId == undefined}>
          <p hidden={deviceName != undefined}>Connected to Device: {deviceId}</p>
          <p hidden={deviceName == undefined}>Connected to Device: {deviceName} ({deviceId})</p>
          <p>Acceleration Records: {accelerations.length}</p>
          <button hidden={recording} onClick={startRecording}>Start Recording</button>
          <button hidden={!recording} onClick={stopRecording}>Stop Recording</button>
          <button hidden={recording || accelerations.length <= 0} onClick={share}>Share</button>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
