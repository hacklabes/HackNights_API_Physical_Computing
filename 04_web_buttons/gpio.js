var http = require('http');
var gpio = require('rpi-gpio');

gpio.destroy();
gpio.setMode(gpio.MODE_BCM);
gpio.setup(21, gpio.DIR_OUT);

var requestOptions = {host: 'localhost', port:'8080', path: '/state' };

function requestCallback(response){
    var responseData = '';
    response.on('data', function(data){
        responseData += data;
    });

    response.on('end', function(){
        gpio.write(21, JSON.parse(responseData).state);
    });
}

function checkState(){
    http.request(requestOptions, requestCallback).end();
}

setInterval(checkState, 600);
