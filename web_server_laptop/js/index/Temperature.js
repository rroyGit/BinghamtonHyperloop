const TelemetryData = require('./TelemetryData');

class Temperature extends TelemetryData {
    
    constructor(document, prefix, numSensors) {
        super();
        [this.document, this.numSensors, this.prefix] = [document, numSensors, prefix];
    }

    init () {
        this.initData(this.document, this.numSensors);
        this.buildSensorElements(this.prefix);
    }

    apply (path) {
        this.sendXMLRequests(`http://${path}:3002/temp/`);
    }
}

module.exports = Temperature;

let document, numSensors, prefix;