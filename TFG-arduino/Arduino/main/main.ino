#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <WiFiClientSecure.h>

#include "config.h"  
#include "MQTT.hpp"
#include "ESP8266_Utils.hpp"
#include "ESP8266_Utils_MQTT.hpp"

const int ledPin = D8;
int tempPin = 0;
const int finPin = D1;


void setup(void)
{
	Serial.begin(115200);
  pinMode(ledPin, OUTPUT);

	ConnectWiFi_STA(true);
  digitalWrite(ledPin, HIGH);
  delay(50);
  digitalWrite(ledPin, LOW);
  delay(100);
  digitalWrite(ledPin, HIGH);
  delay(50);
  digitalWrite(ledPin, LOW);
  
  delay(1000);
  
	InitMqtt();
  digitalWrite(ledPin, HIGH);
  delay(50);
  digitalWrite(ledPin, LOW);
  delay(100);
  digitalWrite(ledPin, HIGH);
  delay(50);
  digitalWrite(ledPin, LOW);
  delay(100);
  digitalWrite(ledPin, HIGH);
  delay(50);
  digitalWrite(ledPin, LOW);

  delay(1000);

  pinMode(finPin, INPUT);

}

void loop()
{

  if(WiFi.status() != WL_CONNECTED){
    ConnectWiFi_STA(true);
  }
  
	HandleMqtt();
 
  DynamicJsonDocument doc(1024);
    
  doc["tipo_activo"] = "lectura";
  doc["device_id"] = "100";
  int value = analogRead(tempPin);
  float millivolts = (value / 1023.0) * 5000;
  float celsius = (millivolts / 10)/2;
  doc["valorLectura"] = celsius;
  doc["timeStamp"] = getTime();
  Serial.print(celsius);
  Serial.print(" degrees Celsius, ");
  
  Serial.print(" final, ");
  if(digitalRead(finPin)==HIGH) {
    doc["tampering"] = 1;
    Serial.println(1);
  }
  else{
    doc["tampering"] = 0;
    Serial.println(0);
  }

  digitalWrite(ledPin, HIGH);
  String output;
  serializeJson(doc, output);
  Serial.println(output);
	PublishMqtt(output);
	delay(200);
  digitalWrite(ledPin, LOW);
  delay(5000);
}
