(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const TelemetryData = require('./TelemetryData');

class Distance extends TelemetryData {
    
    constructor(context, numSensors, numPreviousTimes) {
        super();
        [this.context, this.numSensors, this.numPreviousTimes] = [context, numSensors, numPreviousTimes];
    }

    init () {
        this.initChart(this.context, this.numSensors, this.numPreviousTimes);
    }

    sendRequests (path) {
        this.sendXMLRequests(`http://${path}:3002/dist/`);
    }

    changeAxisLabels () {
        this.resetChartLabel('Time', 'Distance', 's', 'ft');
    }

    setChartAxis (refreshTime) {
        this.resetChartAxis(refreshTime);
    }

}

module.exports = Distance;

let context, numSensors, numPreviousTimes;


},{"./TelemetryData":3}],2:[function(require,module,exports){
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


},{"./TelemetryData":3}],3:[function(require,module,exports){
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



},{}],4:[function(require,module,exports){
const TelemetryData = require('./TelemetryData');

class Temperature extends TelemetryData {
    
    constructor(context, numSensors, numPreviousTimes) {
        super();
        [this.context, this.numSensors, this.numPreviousTimes] = [context, numSensors, numPreviousTimes];
    }

    init () {
        this.initChart(this.context, this.numSensors, this.numPreviousTimes);
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

let context, numSensors, numPreviousTimes;



},{"./TelemetryData":3}],5:[function(require,module,exports){
const Temperature = require('./Temperature');
const Distance = require('./Distance');
const Speed = require('./Speed');

var ctx = document.getElementById('myChart').getContext('2d');

var startButton = document.getElementById("startButton");
var stopButton = document.getElementById("stopButton");
var timeInput = document.getElementById("timeInput");

var tempButton = document.getElementById("temp");
var distButton = document.getElementById("dist");
var speedButton = document.getElementById("speed");

let PATH;

var requestState = "STOP";
var myInterval;
var connectionGood = true;

var sensorState = "Temperature";
var sensorClass = null;

function init () {
    PATH = getCookie('hostName');

    startButton.addEventListener("mouseup", () => {startAction(sensorClass, startButton);} );
    stopButton.addEventListener("mouseup", () => {stopAction(stopButton);} );

    tempButton.addEventListener("click", () => {
        sensorState = "Temperature";
        createClass();
    } );

    distButton.addEventListener("click", () => {
        sensorState = "Distance";
        createClass();
    } );

    speedButton.addEventListener("click", () => {
        sensorState = "Speed";
        createClass();
    } );

    tempButton.click();
}

const startAction = (currentClass, context) => {

    if (requestState == "STOP") {

        if (!connectionGood) {
            alert("Requests could not be sent, other server offline. Restart server!");
            return;
        }

        let valueRefresh = timeInput.value;

        currentClass.setChartAxis(valueRefresh);

        if (valueRefresh === "" || valueRefresh  < 10) {
            alert("Invalid refresh time. Cannot start!");
            return;
        }

        stopButton.style.border = null;
        timeInput.style.background = "#808080";
        timeInput.disabled = true;

        context.classList.remove('mouse-down');
        context.style.borderColor = "#ffffff";

        currentClass.sendRequests(PATH);
        if (connectionGood) myInterval = setInterval(() => (currentClass.sendRequests(PATH)), valueRefresh);
        requestState = "START"
    } else {
        // report error
    }
}

const stopAction = (context) => {
    if (requestState == "START" ) {
        startButton.style.border = null;
        timeInput.style.background = "#ffffff";
        timeInput.disabled = false;

        context.classList.remove('mouse-down');
        context.style.borderColor = "#ffffff";

        clearInterval(myInterval);
        requestState = "STOP";
    } else {
        // report error
    }
}

const createClass = () => {
    let [numSensors, numPreviousTimes] = [2, 15];

    if (sensorClass) sensorClass.destroyChart();

    switch (sensorState) {
        case "Temperature":

            sensorClass = new Temperature(ctx, numSensors, numPreviousTimes);
            tempButton.style.borderColor = "#ffffff";
            distButton.style.border = null;
            speedButton.style.border = null;

            tempButton.disabled = true;
            distButton.disabled = false;
            speedButton.disabled = false;
            break;
        case "Distance":
            sensorClass = new Distance(ctx, numSensors, 20);
            tempButton.style.border = null;
            distButton.style.borderColor = "#ffffff";
            speedButton.style.border = null;

            tempButton.disabled = false;
            distButton.disabled = true;
            speedButton.disabled = false;
            break;
        case "Speed":
            sensorClass = new Speed(ctx, numSensors, 30);
            tempButton.style.border = null;
            distButton.style.border = null;
            speedButton.style.borderColor = "#ffffff";

            tempButton.disabled = false;
            distButton.disabled = false;
            speedButton.disabled = true;
            break;
    }

    sensorClass.init();
    sensorClass.changeAxisLabels();
    sensorClass.setChartAxis(timeInput.value);
}

function getCookie(name) {
	    var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
	    return v ? v[2] : null;
}

stopButton.style.borderColor = "#ffffff";
tempButton.style.borderColor = "#ffffff";

init();

},{"./Distance":1,"./Speed":2,"./Temperature":4}]},{},[5]);
