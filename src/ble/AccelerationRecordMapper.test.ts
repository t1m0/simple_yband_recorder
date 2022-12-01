import { mapAccelerationRecord } from "./AccelerationRecordMapper";
jest.mock('@capacitor-community/bluetooth-le')

test('Handle Notifications', () => {
    const array = new Uint8Array([257, 0, 0, 0, 22, 8, 160, 249, 214, 241]);
    const mockDataView = new DataView(array.buffer,0,10);
    const actualRecord = mapAccelerationRecord(mockDataView);
    expect(actualRecord.recordCount).toBe(1);
    expect(actualRecord.xAxis).toBe(2070);
    expect(actualRecord.yAxis).toBe(-1888);
    expect(actualRecord.zAxis).toBe(-3882);
  });
