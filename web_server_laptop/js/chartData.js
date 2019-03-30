var ctx = document.getElementById('myChart').getContext('2d');

var sensor1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var sensor2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var sensor3 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var sensor4 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];


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

setTimeout(() => {
    chart.data.datasets[0].data = [0, 0, 5, 2, 20, 100, 20, 8, 10, 6];
    chart.update();
},5000);
