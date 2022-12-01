import { BleClient, BleDevice, dataViewToNumbers, numbersToDataView } from '@capacitor-community/bluetooth-le';
import { isPlatform } from '@ionic/react';
import AccelerationRecord from './AccelerationRecord';
import { mapAccelerationRecord } from './AccelerationRecordMapper';
import BleDeviceWrapper from './BLEDeviceWrapper';

const LIVE_SENSOR_SERVICE_UUID = "01550001-5555-5507-0002-01EEDDCCBBAA";
const LIVE_SENSOR_FRAME_RATE_GUID = "01550009-5555-5507-0002-01EEDDCCBBAA";
const LIVE_SENSOR_ACCELERATION_GUID = "0155000D-5555-5507-0002-01EEDDCCBBAA";
const LIVE_SENSOR_FLAG_GUID = "0155000B-5555-5507-0002-01EEDDCCBBAA";

const BLE_SERVICE = "0000180f-0000-1000-8000-00805f9b34fb";


export async function connectToDevice(): Promise<BleDeviceWrapper> {
    if (isPlatform('desktop')) {
        alert("BLE not supported on Desktop!");
        return Promise.reject()
    }
    try {
        BleClient.initialize();
        const device = await BleClient.requestDevice({
            services: [BLE_SERVICE]
        });
        const deviceWrapper = new BleDeviceWrapper(device.deviceId, device.name);
        console.log(`connecting to device '${device.deviceId}'.`,);
        await BleClient.connect(device.deviceId, onDisconnect);
        console.log(`connected to device '${device.deviceId}'.`);
        return Promise.resolve(deviceWrapper);
    } catch (error) {
        console.error(`failed to connect to device.`, error);
        return Promise.reject(error);
    }
}

export async function subscribeToNotifications(deviceId: string, dataCallback: (record: AccelerationRecord) => void): Promise<void> {
    if (isPlatform('desktop')) {
        alert("BLE not supported on Desktop!");
        return Promise.reject()
    }
    try {
        await BleClient.write(deviceId, LIVE_SENSOR_SERVICE_UUID, LIVE_SENSOR_FLAG_GUID, numbersToDataView([1]));
        console.log('live sensor flag updated');
        await BleClient.startNotifications(
            deviceId,
            LIVE_SENSOR_SERVICE_UUID,
            LIVE_SENSOR_ACCELERATION_GUID,
            value => {
                const record = mapAccelerationRecord(value);
                console.log(record);
                dataCallback(record);
            });
        return Promise.resolve();
    } catch (error) {
        console.error(error)
        return Promise.reject(error);
    }
}

export async function unSubscribeToNotifications(deviceId: string): Promise<void> {
    if (isPlatform('desktop')) {
        alert("BLE not supported on Desktop!");
        return Promise.reject()
    }
    try {
        await BleClient.stopNotifications(deviceId, LIVE_SENSOR_SERVICE_UUID, LIVE_SENSOR_ACCELERATION_GUID);
        await BleClient.write(deviceId, LIVE_SENSOR_SERVICE_UUID, LIVE_SENSOR_FLAG_GUID, numbersToDataView([0]));
        console.log('disconnected from device', deviceId);
        return Promise.resolve()
    } catch (error) {
        console.error(error)
        return Promise.reject(error);
    }
}

function onDisconnect(deviceId: string): void {
    console.log(`device ${deviceId} disconnected`);
}
