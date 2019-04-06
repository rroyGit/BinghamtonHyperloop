const TelemetryData = require('./TelemetryData');

class Temperature extends TelemetryData {
    
    constructor(context, numOfTimes) {
        super();
        this.initTelemetryData(context);
    }

    init (numSensors, numPreviousTimes) {
        
        this.setChartDataArray(numPreviousTimes);

        for (let i = 0; i < numSensors; i++) {
            this.addNewSensorToArray();
        }

        this.createXMLRequests();
    }

    sendRequests (path) {
        this.sendXMLRequests(`http://${path}:3002/temp/`);
    }

    setChartAxis (refreshTime) {
        this.resetChartXAxis(refreshTime);
    }
    
}

module.exports = Temperature;


