# Overview

A clock device reading time from web. It shows current date and time on OLED display. It periodically requests current time and date to a time server. I use World Time API (http://worldtimeapi.org/) as a time server. I cannot guarantee how this is reliable and correct, but it is easy to get current date and time as a JSON format.

![assemble](https://github.com/niklauslee/web-clock/blob/main/images/assemble.jpg?raw=true)

# Components

| Part                            | Quantity | Note                      |
| ------------------------------- | -------- | ------------------------- |
| Raspberry Pi Pico               | 1        |                           |
| 1.3" OLED Display (SSD1306 I2C) | 1        | Purchased from Aliexpress |
| Wi-Fi module (ESP-01 module)    | 1        |                           |
| Breadboard                      | 1        |                           |

# Wiring

| Raspberry Pi Pico | ESP8266    | SSD1306   |
| ----------------- | ---------- | --------- |
| 3V3               | VCC, CH_PD | VCC (VDD) |
| GND               | GND        | GND       |
| GP0 (UART0 TX)    | RXD        |           |
| GP1 (UART0 RX)    | TXD        |           |
| GP4 (I2C0 SDA)    |            | SDA       |
| GP5 (I2C0 SCL)    |            | SCL (SCK) |

![circuit](https://github.com/niklauslee/web-clock/blob/main/images/circuit.png?raw=true)

# Setup

To run this project, you need to store `WIFI_SSID`, `WIFI_PASSWORD` keys in storage via Terminal as below.

```js
> storage.setItem('WIFI_SSID', 'MyHome'); // WiFi SSID
> storage.setItem('WIFI_PASSWORD', '********'); // Wi-Fi Password
```
