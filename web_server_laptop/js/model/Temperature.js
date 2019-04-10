const TelemetryData = require('./TelemetryData');

class Temperature extends TelemetryData {
    
    constructor(context, numSensors, numPreviousTimes) {
        super();
        this.init(context,numSensors, numPreviousTimes);
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


