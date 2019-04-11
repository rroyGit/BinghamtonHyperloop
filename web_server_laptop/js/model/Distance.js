const TelemetryData = require('./TelemetryData');

class Distance extends TelemetryData {
    
    constructor(context, numSensors, numPreviousTimes) {
        super();
        [this.context, this.numSensors, this.numPreviousTimes] = [context, numSensors, numPreviousTimes];
    }

    init () {
        this.initChart(this.context, this.numSensors, this.numPreviousTimes);
    }

    sendRequests (path) {
        this.sendXMLRequests(`http://${path}:3002/dist/`);
    }

    changeAxisLabels () {
        this.resetChartLabel('Time', 'Distance', 's', 'ft');
    }

    setChartAxis (refreshTime) {
        this.resetChartAxis(refreshTime);
    }

}

module.exports = Distance;

let context, numSensors, numPreviousTimes;

