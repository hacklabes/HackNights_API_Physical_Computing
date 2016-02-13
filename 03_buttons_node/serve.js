var gpio = require('rpi-gpio');

gpio.destroy();
gpio.setMode(gpio.MODE_BCM);

gpio.setup(16, gpio.DIR_OUT);
gpio.setup(21, gpio.DIR_OUT);

gpio.setup(13, gpio.DIR_IN, gpio.EDGE_BOTH);
gpio.setup(19, gpio.DIR_IN, gpio.EDGE_BOTH);

gpio.on('change', function(channel, value) {
    if(channel == 13){
        gpio.write(16, value);
    }
    if(channel == 19){
        gpio.write(21, value);
    }
});
