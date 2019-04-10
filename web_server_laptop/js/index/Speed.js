const TelemetryData = require('./TelemetryData');

class Speed extends TelemetryData {
    
    constructor(document, prefix, numSensors) {
        super();
        this.init(document, numSensors);
        this.buildSensorElements(prefix);
    }

    apply (path) {
        this.sendXMLRequests(`http://${path}:3002/speed/`);
    }
}

module.exports = Speed;