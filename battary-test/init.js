load('api_config.js');
load('api_gpio.js');
//load('api_mqtt.js');
load('api_net.js');
load('api_sys.js');
load('api_timer.js');
load('api_adc.js');
load('api_rpc.js');
load('api_http.js');

// Helper C function get_led_gpio_pin() in src/main.c returns built-in LED GPIO
// ffi() returns a callbale object for the specified C function.
// As parsing the signature has non-trivial overhead, it's a good practice to
// store the value for later reuse.
let get_led_gpio_pin = ffi('int get_led_gpio_pin()');
// Now call the function to obtain the LED pin number.
let led = get_led_gpio_pin();

// When C function is invoked only once, it's possible to use this shorthand.
let button = ffi('int get_button_gpio_pin()')();
ADC.enable(0);

print("LED GPIO: " + JSON.stringify(led) + "; button GPIO: " + JSON.stringify(button));

let topic = '/devices/' + Cfg.get('device.id') + '/events';

let getInfo = function() {
  return {total_ram: Sys.total_ram(), free_ram: Sys.free_ram(), adc: ADC.read(0)};
};

// Blink built-in LED every second
GPIO.set_mode(led, GPIO.MODE_OUTPUT);

// Timer.set(5000 /* 1 sec */, true /* repeat */, function() {
//   let value = GPIO.write(led,0);
//   Timer.set(100 /* 1 sec */, false /* repeat */, function() {
//     let value = GPIO.write(led,1);
//   }, null)
//   let message = getInfo();
  
//   print(value ? 'Tick' : 'Tock', 'uptime:', Sys.uptime(), message);
  
//   //MQTT.pub(topic, message, 1);
// }, null);

// // Publish to MQTT topic on a button press. Button is wired to GPIO pin 0
// GPIO.set_button_handler(button, GPIO.PULL_UP, GPIO.INT_EDGE_NEG, 200, function() {
//   let topic = '/devices/' + Cfg.get('device.id') + '/events';
//   let message = getInfo();
//   let ok = MQTT.pub(topic, message, 1);
//   print('Published:', ok ? 'yes' : 'no', 'topic:', topic, 'message:', message);
// }, null);

// // Monitor network connectivity.
// Net.setStatusEventHandler(function(ev, arg) {
//   let evs = "???";
//   if (ev === Net.STATUS_DISCONNECTED) {
//     evs = "DISCONNECTED";
//   } else if (ev === Net.STATUS_CONNECTING) {
//     evs = "CONNECTING";
//   } else if (ev === Net.STATUS_CONNECTED) {
//     evs = "CONNECTED";
//   } else if (ev === Net.STATUS_GOT_IP) {
//     evs = "GOT_IP";
//   }
//   print("== Net event:", ev, evs);
// }, null);


// get current ip
//RPC.call(RPC.LOCAL, 'Sys.GetInfo', null, function(resp, ud) {
//  print('Response:', JSON.stringify(resp));
//  print('MAC address:', resp.mac);
//  print('MAC address:', resp.wifi.sta_ip);
//}, null);






// HTTP.query({
//   url: 'http://httpbin.org/post',
//   headers: { 'X-Foo': 'bar' },     // Optional - headers
//   data: {foo: 1, bar: 'baz'},      // Optional. If set, JSON-encoded and POST-ed
//   success: function(body, full_http_msg) { print(body); },
//   error: function(err) { print(err); },  // Optional
// });

//some millisecond settings. adjust to your needs
//let millisToTurnOff = 60000;
//Timer.set(millisToTurnOff , false , function() {
//  print("deep sleep");
//  ESP8266.deepSleep(0);
//}, null);
//
//if(requestUrl.length > 0)
//{
//	//request url not empty so invoke it
//	Net.setStatusEventHandler(function(ev, edata){
//		if(ev !== Net.STATUS_GOT_IP) return;
//		print("httpRequest");
//		HTTP.query({
//				url: requestUrl,
//				success: function(){
//					print('HTTP request sent');
//				},
//				error: function(){
//					print('HTTP request failed');
//				}
//			});
//		Net.setStatusEventHandler(function(){}, null);
//	}, null);
//}


  RPC.addHandler('ADC', function(args) {
    let value = GPIO.write(led,0);
    Timer.set(100 /* 1 sec */, false /* repeat */, function() {
      let value = GPIO.write(led,1);
    }, null);
    let message = getInfo();
    print(value ? 'Tick' : 'Tock', 'uptime:', Sys.uptime(), JSON.stringify(message));
    return message;
  });
