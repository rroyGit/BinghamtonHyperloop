const Temperature = require('./Temperature');

var ctx = document.getElementById('myChart').getContext('2d');

var startButton = document.getElementById("startButton");
var stopButton = document.getElementById("stopButton");
var timeInput = document.getElementById("timeInput");

const PATH = "localhost";

var state = "STOP";
var myInterval;
var connectionGood = true;

function init () {
    let [numSensors, numPreviousTimes] = [2, 20];
    let currentClass = new Temperature(ctx, numSensors, numPreviousTimes);
    
    currentClass.setChartAxis(timeInput.value);

    startButton.addEventListener("mouseup", () => {startAction(currentClass, startButton);} );
    stopButton.addEventListener("mouseup", () => {stopAction(stopButton);} );
}

const startAction = (currentClass, context) => {

    if (state == "STOP") {

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
        state = "START"
    } else {
        // report error
    }
}

const stopAction = (context) => {
    if (state == "START" ) {
        startButton.style.border = null;
        timeInput.style.background = "#ffffff";
        timeInput.disabled = false;

        context.classList.remove('mouse-down');
        context.style.borderColor = "#ffffff";

        clearInterval(myInterval);
        state = "STOP";
    } else {
        // report error
    }
}

init();

stopButton.style.borderColor = "#ffffff";
