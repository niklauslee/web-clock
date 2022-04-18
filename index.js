const { ESP8266HTTPClient } = require("esp8266-http-client");
const { SSD1306 } = require("ssd1306/i2c");
const font = require("simple-fonts/minimal");

const esp8266 = new ESP8266HTTPClient(null, { debug: true });
const ssd1306 = new SSD1306();

const REQ_INTV = 1000 * 60 * 60 * 2; // 2 hours
const UPD_INTV = 1000; // 1 seconds
const WEEK = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

var gc = null; // graphic context
var time = 0; // current time
var requestError = false;

function digit2(num) {
  var ns = num.toString();
  if (ns.length === 1) ns = "0" + ns;
  return ns;
}

function update() {
  var t = time + millis();
  var date = new Date(t);
  var h = date.getHours();
  var am = true;
  if (h > 12) {
    h = h - 12;
    am = false;
  }
  var m = date.getMinutes();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var dw = WEEK[date.getDay()];
  gc.clearScreen();
  gc.setFontScale(6, 6);
  gc.drawText(5, 23, `${digit2(h)}:${digit2(m)}`);
  gc.setFontScale(2, 2);
  gc.drawText(5, 5, `${dw} ${digit2(month)}-${digit2(day)}`);
  gc.drawText(105, 5, am ? "AM" : "PM");
  if (requestError) {
    gc.setFontScale(1, 1);
    gc.drawText(5, 59, "FAILED TIME REQUEST");
  }
  gc.display();
}

function request() {
  esp8266
    .http("http://worldtimeapi.org/api/ip")
    .then((res) => {
      console.log(res);
      var data = JSON.parse(res.body);
      var unixtime = data.unixtime + data.raw_offset;
      time = unixtime * 1000 - millis();
      requestError = false;
    })
    .catch((err) => {
      console.log(err);
      requestError = true;
      update();
    });
}

// setup SSD1306
ssd1306.setup(board.i2c(0), { width: 128, height: 64 }, () => {
  console.log("SSD1306 initialized");
  gc = ssd1306.getContext();
  gc.setFont(font);
  gc.clearScreen();
  gc.display();
  // setup ESP8266
  console.log("connecting Wi-Fi...");
  esp8266
    .wifi()
    .then(() => {
      console.log("Wi-Fi connected");
      setInterval(request, REQ_INTV);
      setInterval(update, UPD_INTV);
      request();
    })
    .catch((err) => {
      console.log(err);
      gc.clearScreen();
      gc.drawText(0, 20, "Unable to connect\nWiFi network");
      gc.display();
    });
});
