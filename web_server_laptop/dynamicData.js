var sensor1Container = document.getElementById("sensor1");
var sensor2Container = document.getElementById("sensor2");
var counter = 0;

var request;
var request2;


function init () {
    
    request = new XMLHttpRequest();
    request2 = new XMLHttpRequest();

    const getNumber = (data) => {
        const regex = /([-| ]\d+)/;
        const value = regex.exec(data);
        return value[1];
    }

    request.onload = function () {
        sensor1Container.style.color = "#ff0026";
        sensor1Container.innerHTML = getNumber(request.responseText);
    }

    request2.onload = function () {
        sensor2Container.style.color = "#ff0026";
        sensor2Container.innerHTML = getNumber(request2.responseText);
    }
}


function sendRequests () {
    counter++;

    request.open("GET", "http://localhost:3002/temp/1");
    request2.open("GET", "http://localhost:3002/temp/2");
    request.send();
    request2.send();

    if (counter === 20) clearInterval(myInterval);
}


init();
var myInterval = setInterval(sendRequests, 2000);
