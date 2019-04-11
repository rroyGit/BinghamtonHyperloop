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

    initChart (context, numSensors, numPreviousTimes) {
        this.borderColors = ['rgb(50, 99, 132)', 'rgb(150, 169, 132)', 'rgb(70, 170, 132)','rgb(250, 99, 132)'];
        this.chart = new Chart(context, initChart);
        this.numSensors = numSensors;

        setSensorLines(this.numSensors, this.chart, this.borderColors);
        this.setChartDataArray(numPreviousTimes);
       
        for (let i = 0; i < this.numSensors; i++) addNewSensorToArray(this.sensorArrays, this.lenOfEachArray);
    }

    setChartDataArray (numPreviousTimes) {
        this.lenOfEachArray = numPreviousTimes;
        this.sensorArrays = new Array();

        this.chart.data.datasets.forEach((data, index) => {
            data = this.sensorArrays[index];
        });

        let timeArray = new Array(this.lenOfEachArray).map((element, index) => {element = index * this });
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
        return this.numSensors;
    }

    resetChartAxis (refreshTime) {
        resetChartXAxis (refreshTime, this.lenOfEachArray, this.tickXLabel, this.chart);
        resetChartYAxis (this.tickYLabel, this.chart);
    }

    resetChartLabel (xAxisName, yAxisName, xAxisTick, yAxisTick) {
        [this.tickXLabel, this.tickYLabel] = [xAxisTick, yAxisTick];
    
        this.chart.options.scales.xAxes[0].scaleLabel.labelString = xAxisName;
        this.chart.options.scales.yAxes[0].scaleLabel.labelString = yAxisName;
        this.chart.update();
    }

    destroyChart () {
        this.chart.destroy();
    }

    // ---------------------------- abstract methods --------------------------
    sendRequests (path) {
        throw new Error("Method 'sendRequests(path)' must be implemented.");
    }

    changeAxisLabels () {
        throw new Error("Method 'changeAxisLabels()' must be implemented.");
    }
}

module.exports = TelemetryData;

let tickYLabel;
let tickXLabel;
let numSensors;
let xAxisLabel;
let refreshTime;
let lenOfEachArray;

let sensorArrays;
let chart;
let borderColors;

Chart.defaults.global.defaultFontColor = 'white';
Chart.defaults.global.defaultFontSize = 16;

const initChart = {
    type: 'line',

    data: {
        labels: xAxisLabel,
        datasets: []
    },

    options: {
        responsive: false,
        scales: {
            yAxes: [{
                ticks: {
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

const resetChartXAxis = (refreshTime, lenOfEachArray, tickXLabel, chart) => {
    let xAxisLabel = new Array(lenOfEachArray).fill(0);
    xAxisLabel = xAxisLabel.map((element, index) => {
        return `${(index * refreshTime)/(1000)} ${tickXLabel}`;
    });

    chart.data.labels = xAxisLabel;
    chart.update();
}

const resetChartYAxis = (yAxisTick, chart) => {
    chart.options.scales.yAxes[0].ticks.callback = function(value, index, values) {
        return value + ` ${yAxisTick}`;
    }
    chart.update();
}

const addNewSensorToArray = (sensorArrays, lenOfEachArray) => {
    let sensorArray = new Array(lenOfEachArray).fill(0);
    sensorArrays.push(sensorArray);
}

const setSensorLines = (numSensors, chart, borderColors) => {
    chart.data.datasets = [];
    for (let i = 0; i < numSensors; i++) {
        let lineColor = borderColors[i];
        let lineName = `Sensor ${i+1}`;

        let set = {
            label: lineName,
            borderColor: lineColor,
            data: []
        }
        chart.data.datasets[i] = set; 
    }
    chart.update();
}


