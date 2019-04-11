const TelemetryData = require('./TelemetryData');

class Speed extends TelemetryData {
    
    constructor(context, numSensors, numPreviousTimes) {
        super();
        [this.context, this.numSensors, this.numPreviousTimes] = [context, numSensors, numPreviousTimes];
    }

    init () {
        this.initChart(this.context, this.numSensors, this.numPreviousTimes);
    }

    sendRequests (path) {
        this.sendXMLRequests(`http://${path}:3002/speed/`);
    }

    changeAxisLabels () {
        this.resetChartLabel('Time', 'Speed', 's', 'mph');
    }

    setChartAxis (refreshTime) {
        this.resetChartAxis(refreshTime);
    }

}

module.exports = Speed;

let context, numSensors, numPreviousTimes;

