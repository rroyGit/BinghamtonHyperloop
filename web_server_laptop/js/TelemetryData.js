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

    init (context, numSensors, numPreviousTimes) {
        this.chart = new Chart(context, initChart);
        
        this.setChartDataArray(numPreviousTimes);
        for (let i = 0; i < numSensors; i++) this.addNewSensorToArray();
    }

    setChartDataArray (numPreviousTimes) {
        this.lenOfEachArray = numPreviousTimes;
        this.sensorArrays = new Array();

        this.chart.data.datasets.forEach((data, index) => {
            data = this.sensorArrays[index];
        });

        let timeArray = new Array(this.lenOfEachArray).map((element, index) => {element = index * this });
    }
    
    addNewSensorToArray () {
        let sensorArray = new Array(this.lenOfEachArray).fill(0);
        this.sensorArrays.push(sensorArray);
    }

    setXMLOnLoad (request) {
        
        const wrapSensorArray = (index) => {return this.getSensorArray(index)};
        const wrapSetSensorArray = (index, data) => {this.setSensorArray(index, data);};

        request.onload = () => {
            let sensorIndex = request.index;
            
            let sensorArray = wrapSensorArray(sensorIndex);
            
            let value;
            if ((value = getNumber(request.responseText)) != null) {
                this.chart.data.datasets[sensorIndex].data = updateDataArray(sensorArray, value, this.lenOfEachArray);
            } else {
                this.chart.data.datasets[sensorIndex].data = updateDataArray(sensorArray, -1, this.lenOfEachArray);
            }

            wrapSetSensorArray(sensorIndex, this.chart.data.datasets[sensorIndex].data);
            
            this.chart.update();
        }
    }

    sendXMLRequests (link) {
       for (let i = 0; i < this.getNumOfSensors(); i++) {
            let sensorId = i + 1;
            let finalLink = link.concat(`${sensorId}`);

            let request = new XMLHttpRequest();

            request.open("GET", finalLink);
            request.index = i;
            this.setXMLOnLoad(request);
            request.send();            
        }
    }

    getSensorArray (index) {
        return this.sensorArrays[index];
    }
    
    setSensorArray (index, sensorArray) {
        this.sensorArrays[index] = sensorArray;
    }
    
    getNumOfSensors () {
        return this.sensorArrays.length;
    }

    setChartAxis (refreshTime) {
        resetChartXAxis (refreshTime, this.lenOfEachArray, this.chart);
    }

    // ---------------------------- abstract methods --------------------------
    sendRequests (path) {
        throw new Error("Method 'sendRequests(path)' must be implemented.");
    }
}

module.exports = TelemetryData;

let xAxisLabel;
let refreshTime;
let lenOfEachArray;
let XMLRequestsArray;
let sensorArrays;
let chart;

Chart.defaults.global.defaultFontColor = 'white';
Chart.defaults.global.defaultFontSize = 16;

const initChart = {
    type: 'line',

    data: {
        labels: xAxisLabel,
        datasets: [
            {
                label: 'Sensor 1',
                
                borderColor: 'rgb(50, 99, 132)',
                data: []
            }, {
                label: 'Sensor 2',
                
                borderColor: 'rgb(150, 169, 132)',
                data: []
            }, {
                label: 'Sensor 3',
                
                borderColor: 'rgb(70, 170, 132)',
                data: []
            }, {
                label: 'Sensor 4',
                
                borderColor: 'rgb(250, 99, 132)',
                data: []
            }
        ]
    },

    options: {
        responsive: false,
        scales: {
            
            yAxes: [{
                ticks: {
                    callback: function(value, index, values) {
                        return value + ' °f';
                    },
                    suggestedMax: 150
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Temperature',
                    fontColor: 'white'
                }
            }],
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Time',
                    fontColor: 'white'
                }
            }]
        }
    }
}

const getNumber = (data) => {
    const regex = /(-*\d+\.?\d*)/;
    let value = regex.exec(data);

    if (value === null) return null;
    
    value = value[1];
    if (value.slice(-1) === '.') value + '0';
    return value;
}

const updateDataArray = (array, newValue, lenOfEachArray) => {
    
    let temp = array.slice(0, lenOfEachArray - 1);
    return [newValue].concat(temp);
}

const resetChartXAxis = (refreshTime, lenOfEachArray, chart) => {
    let xAxisLabel = new Array(lenOfEachArray).fill(0);
    xAxisLabel = xAxisLabel.map((element, index) => {
        return `${(index * refreshTime)/(1000)} s`;
    });

    chart.data.labels = xAxisLabel;
    chart.update();
}


