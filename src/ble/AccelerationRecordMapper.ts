import AccelerationRecord from "./AccelerationRecord";

export function mapAccelerationRecord(dataView: DataView) {
    const byteArray = dataViewToSignedNumbers(dataView);

    console.log("Numbers: ", byteArray);

    const recordCount = toNumber(byteArray, 0, 4)
    const xAxis = toNumber(byteArray, 4, 2)
    const yAxis = toNumber(byteArray, 6, 2)
    const zAxis = toNumber(byteArray, 8, 2)
    const record = new AccelerationRecord(recordCount, xAxis, yAxis, zAxis);
    console.log(`converted '${byteArray}' to '${record}'`)
    return record;
}

function dataViewToSignedNumbers(dataView: DataView) {

    const byteArray = new Array<number>();

    for (let index = 0; index < dataView.byteLength; index++) {
        const int8 = dataView.getInt8(index);
        byteArray.push(int8);
    }

    return byteArray;
}

function toNumber(bArray: number[], start: number, length: number) {
    const array = new Array<number>();
    let current = start
    while (current < (start + length)) {
        array.push(bArray[current])
        current += 1
    }
    let value = 0;
    for (var i = array.length - 1; i >= 0; i--) {
        value = (value * 256) + array[i];
    }

    return value
}
