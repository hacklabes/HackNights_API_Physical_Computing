var http = require('http');
var gpio = require('rpi-gpio');

var LED_PIN = 21;
var HOST = "127.0.0.1";
var PORT = process.env.PORT || 8080;
var USERNAME = "nottoopublic";

gpio.destroy();
gpio.setMode(gpio.MODE_BCM);
gpio.setup(LED_PIN, gpio.DIR_OUT);

var lastTweetId = '';

var requestOptions = {host:HOST, port:PORT, path:'/tweet?usr='+USERNAME};

function requestCallback(response){
    var responseData = '';
    response.on('data', function(data){
        responseData += data;
    });

    response.on('end', function(){
        var parsed = JSON.parse(responseData);
        if("id_str" in parsed && parsed.id_str != lastTweetId){
            lastTweetId = parsed.id_str;
            gpio.write(LED_PIN, 1);
            setTimeout(function(){gpio.write(LED_PIN, 0);}, 5000);
        }
    });
}

function checkState(){
    http.request(requestOptions, requestCallback).end();
}

setInterval(checkState, 600);
