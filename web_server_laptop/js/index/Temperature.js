const TelemetryData = require('./TelemetryData');

class Temperature extends TelemetryData {
    
    constructor(document, prefix, numSensors) {
        super();
        this.init(document, numSensors);
        this.buildSensorElements(prefix);
    }

    apply (path) {
        this.sendXMLRequests(`http://${path}:3002/temp/`);
    }
}

module.exports = Temperature;