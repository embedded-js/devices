import Thermometer from "j5e/thermometer";
import LED from "j5e/led";
import { timer } from "j5e/fn";

let last = 0;
let myTimer;

const thermometer = await new Thermometer({
  pin: 14,
  threshold: 4,
  toCelsius: function(raw) {
    const mV = 3.3 * 1000 * raw / 1023;
    return (mV / 10) - 50;
  }
});

const led = await new LED({
  pin: 12,
  pwm: true
});

thermometer.on("change", function(data) {
  
  trace(`${data.F}° Fahrenheit\n`);
  if (last > data.raw) {
    led.blink(100);
    last = data.raw;
  }
  
  if (last < data.raw) {
    led.stop().on();
    last = data.raw;
  }
  
  if (typeof myTimer !== "undefined" && myTimer !== null) timer.clearTimeout(myTimer);
  
  myTimer = timer.setTimeout(function() {
    myTimer = null;
    led.stop().off();
  }, 1000);

});