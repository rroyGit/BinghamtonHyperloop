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
    let [numSensors, numPreviousTimes] = [4, 15];

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

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

stopButton.style.borderColor = "#ffffff";
tempButton.style.borderColor = "#ffffff";

init();
