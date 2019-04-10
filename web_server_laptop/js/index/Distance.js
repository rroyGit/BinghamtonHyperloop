const TelemetryData = require('./TelemetryData');

class Distance extends TelemetryData {
    
    constructor(document, prefix, numSensors) {
        super();
        this.init(document, numSensors);
        this.buildSensorElements(prefix);
    }

    apply (path) {
        this.sendXMLRequests(`http://${path}:3002/dist/`);
    }
}

module.exports = Distance;

