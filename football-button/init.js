load('api_config.js');
load('api_gpio.js');
load('api_mqtt.js');
load('api_net.js');
load('api_sys.js');
load('api_timer.js');
load("api_esp8266.js");
load('api_rpc.js');
load('api_http.js');

// Helper C function get_led_gpio_pin() in src/main.c returns built-in LED GPIO
// ffi() returns a callbale object for the specified C function.
// As parsing the signature has non-trivial overhead, it's a good practice to
// store the value for later reuse.
let get_led_gpio_pin = ffi('int get_led_gpio_pin()');
// Now call the function to obtain the LED pin number.
let led = get_led_gpio_pin();
//some millisecond settings. adjust to your needs
let millisToTurnOff = 60000;
//set io.adafruit mqtt settings and set feed name here:
let feedName = 'wifiButton01';
//***********************************************

//
Timer.set(millisToTurnOff , false , function() {
  print("deep sleep");
  ESP8266.deepSleep(0);
}, null);


//trying mqtt
MQTT.setEventHandler(function(conn, ev, edata) 
{
	if (ev === MQTT.EV_CONNACK)
	{
		let topic = Cfg.get('mqtt.user') + '/feeds/' + feedName;
		let ok = MQTT.pub(topic, JSON.stringify(1), 1);
		if(ok) print('sent mqtt')
		else print('failed mqtt');
		MQTT.setEventHandler(function(){}, null);
	}
}, null);



// Blink built-in LED every second
GPIO.set_mode(led, GPIO.MODE_OUTPUT);
Timer.set(1000 /* 1 sec */, true /* repeat */, function() {
  let value = GPIO.write(led,0);
  Timer.set(50 /* 1 sec */, false /* repeat */, function() {
    let value = GPIO.write(led,1);
  }, null);
}, null);
