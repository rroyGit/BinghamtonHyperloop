var sensor1Container = document.getElementById("sensor1");
var sensor2Container = document.getElementById("sensor2");
var counter = 0;


function getTemps () {
    console.log("Getting update...");
    counter++;

    if (counter == 20) clearInterval(myInterval);

    var request = new XMLHttpRequest();
    var request2 = new XMLHttpRequest();

    request.open("GET", "http://localhost:3002/temp/1");
    request2.open("GET", "http://localhost:3002/temp/2");

    request.onload = function() {
        sensor1Container.innerHTML = request.responseText;
    }

    request2.onload = function() {
        sensor2Container.innerHTML = request2.responseText;
    }

    request.send();
    request2.send();
}

var myInterval = setInterval(getTemps, 2000);
