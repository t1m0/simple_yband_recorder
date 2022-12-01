export default class AccelerationRecord {
    timeStamp = Date.now();
    recordCount:number;
    xAxis:number;
    yAxis:number;
    zAxis:number;
    constructor(recordCount:number,xAxis:number,yAxis:number,zAxis:number) {
        this.recordCount = recordCount;
        this.xAxis = xAxis;
        this.yAxis = yAxis;
        this.zAxis = zAxis;
    }
}