var sensor1Container = document.getElementById("tempSensor1");
var sensor2Container = document.getElementById("tempSensor2");

var startButton = document.getElementById("startButton");
var stopButton = document.getElementById("stopButton");
var timeInput = document.getElementById("timeInput");

var state = "STOP";
var myInterval;
var connectionGood = true;

const PATH = "149.125.69.160";

startButton.addEventListener("mouseup", function(){
    if (request !== undefined && request2 !== undefined && state !== "START") {
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
        this.classList.remove('mouse-down');
        this.style.borderColor = "#ffffff";

        sendRequests();
        if (connectionGood) myInterval = setInterval(sendRequests, valueRefresh);
    } else {
        // report error
    }
});

stopButton.addEventListener("mouseup", function(){
    if (request !== undefined && request2 !== undefined && state !== "STOP" ) {
        startButton.style.border = null;
        timeInput.style.background = "#ffffff";
        timeInput.disabled = false;

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
    // request.onreadystatechange = function() {
    //     if (request.readyState === 4){   //if complete
    //         if(request.status === 200){  //check if "OK" (200)
    //             //success
    //         } else {
    //             connectionGood = false;
    //             //alert("Requests could not be sent! !200");
    //         }
    //     } else {
    //         connectionGood = false;
    //         alert("Requests could not be sent, other server offline. Restart server! (1)");
    //     }
    // }

    // request2.onreadystatechange = function() {
    //     if (request2.readyState === 4){   //if complete
    //         if(request2.status === 200){  //check if "OK" (200)
    //             //success
    //         } else {
    //             connectionGood = false;
    //             //alert("Requests could not be sent! !200");
    //         }
    //     } else {
    //         connectionGood = false;
    //         alert("Requests could not be sent, other server offline. Restart server! (2)");
    //     }
    // }

    // request.onerror = function (e) {
    //     connectionGood = false;
    //     //alert("Requests could not be sent! onerror");
    // }

    // request2.onerror = function (e) {
    //     connectionGood = false;
    //     //alert("Requests could not be sent! onerror");
    // }
    
}

function sendRequests () {
    request.open("GET", `http://${PATH}:3002/temp/1`);
    request2.open("GET", `http://${PATH}:3002/temp/2`);

    request.send(); 
    request2.send();
}

init();

stopButton.style.borderColor = "#ffffff";
