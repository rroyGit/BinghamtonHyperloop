/*
    Abstract class for the many types of telemetry data enclosing similar functionality
    through their own implementations
*/


class TelemetryData {
    
    constructor () {
        if (this.constructor == TelemetryData) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }

    initData (document, numSensors) {
        this.document = document;
        this.numSensors = numSensors;
        this.sensorsSeqNum = new Array(this.numSensors).fill(-1);
    }

    setXMLOnLoad (request) {
        request.onload = () => {
            let sensorIndex = request.index;
            let sensorElement = this.getSensorElement(sensorIndex);
            sensorElement.style.color = "#ff0026";
            
            let value = getNumber(request.response.sensorValue);
            let seqNum = getNumber(request.response.seqNum);

            let storedSeqNum = this.sensorsSeqNum[sensorIndex];

            //console.log(storedSeqNum + " " + seqNum + " " + sensorIndex);

            if (storedSeqNum !== -1 && storedSeqNum === seqNum) {
                let errorBlock = this.document.getElementById("errorDiv");
                // errorBlock.style.display = "block";
                let sensorNames = this.document.getElementById("sensorNames");
                sensorNames.innerHTML = `${sensorIndex + 1}`;
            }

            this.sensorsSeqNum[sensorIndex] = seqNum;
            
            if (value != null) {
                let sensorElement = this.getSensorElement(sensorIndex);
                sensorElement.innerHTML = value;
            } else {
                sensorElement.innerHTML = "Error";
            }
        }
    }

    sendXMLRequests (link) {
       for (let i = 0; i < this.getNumOfSensors(); i++) {
            let sensorId = i + 1;
            let finalLink = link.concat(`${sensorId}`);

            let request = new XMLHttpRequest();
            
            request.open("GET", finalLink);
            request.responseType = "json";
            request.index = i;
            this.setXMLOnLoad(request);
            request.send();            
        }
    }

    buildSensorElements (prefix) {
        this.sensorElements = [];

        for (let i = 0; i < this.getNumOfSensors(); i++) {
            let sensorElementName = `${prefix}${i+1}`
            this.sensorElements.push(this.document.getElementById(sensorElementName));
        }
    }

    getNumOfSensors () {
        return this.numSensors;
    }

    getSensorElement (index)  {
        return this.sensorElements[index];
    }
    
    setSensorArray (index, sensorElement) {
        this.sensorArrays[index] = sensorElement;
    }
    
    // ---------------------------- abstract methods --------------------------
    apply (path) {
        throw new Error("Method 'apply(path)' must be implemented.");
    }
}

module.exports = TelemetryData;

let document;
let sensorsSeqNum;
let numSensors;
let refreshTime;
let sensorElements;
let sensorElementPrefix;

const getNumber = (data) => {
    const regex = /(-*\d+\.?\d*)/;
    let value = regex.exec(data);

    if (value === null) return null;
    
    value = value[1];
    if (value.slice(-1) === '.') value + '0';
    return value;
}
