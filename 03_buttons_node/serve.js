var gpio = require('rpi-gpio');
 
gpio.mode(MODE_BCM);
gpio.setup(20, gpio.DIR_OUT);
gpio.setup(21, gpio.DIR_OUT);


function write(pin, value) {
    gpio.write(pin, value, function(err) {
        if (err) throw err;
        console.log('Wrote '+value+' to pin '+pin);
    });
}
