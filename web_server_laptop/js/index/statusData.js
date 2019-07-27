const Temperature = require('./Temperature');
const Distance = require('./Distance');
const Speed = require('./Speed');

var startButton = document.getElementById("startButton");
var stopButton = document.getElementById("stopButton");
var timeInput = document.getElementById("timeInput");



var state = "STOP";
var myInterval;
var connectionGood = true;

const PATH = "localhost";

let classes;

function init () {
    classes = [new Temperature(document, 'tempSensor', 4),
                new Distance(document, 'distSensor', 4)];
                //new Speed(document, 'speedSensor', 2)];

    classes.forEach(sensorClass => { sensorClass.init(); });
    
    startButton.addEventListener("mouseup", () => {startAction(startButton);});
    stopButton.addEventListener("mouseup", () => {stopAction(stopButton);});
}

const startAction = (context) => {
    if (state !== "START") {
        if (!connectionGood) {
            alert("Requests could not be sent, other server offline. Restart server!");
            return;
        }
        
        let valueRefresh = timeInput.value;
       
        if (valueRefresh === "" || valueRefresh  < 10) {
            alert("Invalid refresh time. Cannot start!");
            return;
        }

        stopButton.style.border = null;
        timeInput.style.background = "#808080";
        timeInput.disabled = true;
        
        state = "START"
        context.classList.remove('mouse-down');
        context.style.borderColor = "#ffffff";

        sendRequests();
        if (connectionGood) myInterval = setInterval(sendRequests, valueRefresh);

    } else {
        // report error
    }
}

const stopAction = (context) => {
    if (state !== "STOP" ) {
        startButton.style.border = null;
        timeInput.style.background = "#ffffff";
        timeInput.disabled = false;

        state = "STOP"
        context.classList.remove('mouse-down');
        context.style.borderColor = "#ffffff";

        clearInterval(myInterval);
    } else {
        // report error
    }
}

function sendRequests () {
    classes.forEach(sensorClass => { sensorClass.apply(PATH); });
}

init();

stopButton.style.borderColor = "#ffffff";
