export default class BleDeviceWrapper {
    id: string;
    name: string | undefined;
    constructor(id: string, name: string | undefined) {
        this.id = id;
        this.name = name;
    }
}
