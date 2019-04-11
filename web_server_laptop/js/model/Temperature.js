const TelemetryData = require('./TelemetryData');

class Temperature extends TelemetryData {
    
    constructor(context, numSensors, numPreviousTimes) {
        super();
        [this.context, this.numSensors, this.numPreviousTimes] = [context, numSensors, numPreviousTimes];
    }

    init () {
        this.initChart(this.context, this.numSensors, this.numPreviousTimes);
    }

    sendRequests (path) {
        this.sendXMLRequests(`http://${path}:3002/temp/`);
    }

    changeAxisLabels () {
        this.resetChartLabel('Time', 'Temperature', 's', '°f');
    }

    setChartAxis (refreshTime) {
        this.resetChartAxis(refreshTime);
    }

}

module.exports = Temperature;

let context, numSensors, numPreviousTimes;


