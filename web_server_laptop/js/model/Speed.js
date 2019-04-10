const TelemetryData = require('./TelemetryData');

class Speed extends TelemetryData {
    
    constructor(context, numSensors, numPreviousTimes) {
        super();
        this.init(context,numSensors, numPreviousTimes);
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


