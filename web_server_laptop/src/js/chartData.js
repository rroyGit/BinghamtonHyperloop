var ctx = document.getElementById('myChart').getContext('2d');

var startButton = document.getElementById("startButton");
var stopButton = document.getElementById("stopButton");
var timeInput = document.getElementById("timeInput");

var sensor1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var sensor2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var sensor3 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var sensor4 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

const PATH = "149.125.70.21";

var state = "STOP";
var myInterval;
var connectionGood = true;

var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        datasets: [{
            label: 'Sensor 1',
            
            borderColor: 'rgb(50, 99, 132)',
            data: sensor1
        }, {
            label: 'Sensor 2',
            
            borderColor: 'rgb(100, 99, 132)',
            data: sensor2
        }, {
            label: 'Sensor 3',
            
            borderColor: 'rgb(150, 99, 132)',
            data: sensor3
        }, {
            label: 'Sensor 4',
            
            borderColor: 'rgb(200, 99, 132)',
            data: sensor4
        }
    
        ]
    },

    // Configuration options go here
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
                    labelString: 'Temperature'
                }
            }],
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Readings'
                }
            }]
        }
    }
});

function updateDataArray2 (array, newValue) {
    // last 9 elts
    temp = array.slice(1);
    array.length = 0;
    let a = temp.concat([newValue]);
    array.push(a);
}

function updateDataArray (array, newValue) {
    // last 9 elts
    temp = array.slice(1);
    return temp.concat([newValue]);
}

var requestSensor1;
var requestSensor2;

function init () {
    requestSensor1 = new XMLHttpRequest();
    requestSensor2 = new XMLHttpRequest();
    
    const getNumber = (data) => {
        const regex = /(-*\d+\.?\d*)/;
        let value = regex.exec(data);

        if (value === null) return null;
        
        value = value[1];
        if (value.slice(-1) === '.') value + '0';
        return value;
    }

    requestSensor1.onload = function () {
       
        let value;
        if ((value = getNumber(requestSensor1.responseText)) != null) {
            chart.data.datasets[0].data = updateDataArray(sensor1, value);
        } else {
            chart.data.datasets[0].data = updateDataArray(sensor1, -1);
        }
        
        sensor1 = chart.data.datasets[0].data;
        chart.update();
    }

    requestSensor2.onload = function () {
        
        let value;
        if ((value = getNumber(requestSensor2.responseText)) != null) {
            chart.data.datasets[1].data = updateDataArray(sensor2, value);
        } else {
            chart.data.datasets[1].data = updateDataArray(sensor2, -1);
        }
        sensor2 = chart.data.datasets[1].data;
        chart.update();
    }
}

function sendRequests () {
    requestSensor1.open("GET", `http://${PATH}:3002/temp/1`);
    requestSensor2.open("GET", `http://${PATH}:3002/temp/2`);

    requestSensor1.send(); 
    requestSensor2.send();
}

startButton.addEventListener("mouseup", function() {

    if (requestSensor1 !== undefined && requestSensor2 !== undefined && state !== "START") {
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

stopButton.addEventListener("mouseup", function() {
    if (requestSensor1 !== undefined && requestSensor2 !== undefined && state !== "STOP" ) {
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

init();

stopButton.style.borderColor = "#ffffff";
