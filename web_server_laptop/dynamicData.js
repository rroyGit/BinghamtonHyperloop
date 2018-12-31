var sensor1Container = document.getElementById("tempSensor1");
var sensor2Container = document.getElementById("tempSensor2");

var startButton = document.getElementById("startButton");
var stopButton = document.getElementById("stopButton");

var state = "STOP";
var myInterval;

const PATH = "192.168.1.11";

startButton.addEventListener("mouseup", function(){
    if (request !== undefined && request2 !== undefined && state !== "START") {
        stopButton.style.border = null;

        state = "START"
        this.classList.remove('mouse-down');
        this.style.borderColor = "#ffffff";

        sendRequests();
        myInterval = setInterval(sendRequests, 2000);
    } else {
        // report error
    }
});

stopButton.addEventListener("mouseup", function(){
    if (request !== undefined && request2 !== undefined && state !== "STOP" ) {
        startButton.style.border = null;

        state = "STOP"
        this.classList.remove('mouse-down');
        this.style.borderColor = "#ffffff";

        clearInterval(myInterval);
    } else {
        // report error
    }
});

var request;
var request2;

function init () {
    request = new XMLHttpRequest();
    request2 = new XMLHttpRequest();
    

    const getNumber = (data) => {
        const regex = /(-*\d+\.?\d*)/;
        let value = regex.exec(data);

        if (value === null) return null;
        
        value = value[1];
        if (value.slice(-1) === '.') value + '0';
        return value;
    }

    request.onload = function () {
        sensor1Container.style.color = "#ff0026";
        let value;
        if ((value = getNumber(request.responseText)) != null) {
            sensor1Container.innerHTML = value;
        } else {
            sensor1Container.innerHTML = "ERROR";
        }
    }

    request2.onload = function () {
        sensor2Container.style.color = "#ff0026";
        let value;
        if ((value = getNumber(request2.responseText)) != null) {
            sensor2Container.innerHTML = value;
        } else {
            sensor2Container.innerHTML = "ERROR";
        }
    }
}

function sendRequests () {
    request.open("GET", `http://${PATH}:3002/temp/1`);
    request2.open("GET", `http://${PATH}:3002/temp/2`);

    request.send();
    request2.send();
}

init();

