String devName = "TFG-1";

// Conecta el dispositivo a una red WiFi en modo estación (STA)
void ConnectWiFi_STA(bool useStaticIP = false)
{
   Serial.println("");
   WiFi.mode(WIFI_STA);
   WiFi.hostname(devName.c_str());
   WiFi.begin(ssid, password);
   while (WiFi.status() != WL_CONNECTED) 
   { 
     delay(100);  
     Serial.print('.'); 
     
   }
   randomSeed(micros());
   Serial.println("");
   Serial.print("Iniciado STA:\t");
   Serial.println(ssid);
   Serial.print("IP address:\t");
   Serial.println(WiFi.localIP());
}

// Configura el reloj utilizando la sincronización de tiempo NTP
void setClock()
{
  configTime(0, 0, "ntp.roa.es", "pool.ntp.org");

  Serial.print("Waiting for NTP time sync: ");
  time_t now = time(nullptr);
  while (now < 8 * 3600 * 2) {
    delay(500);
    Serial.print(".");
    now = time(nullptr);
  }
  Serial.println("");
  struct tm timeinfo;
  gmtime_r(&now, &timeinfo);
  Serial.print("Current time: ");
  Serial.print(asctime(&timeinfo));
}

// Obtiene la hora actual formateada como una cadena de caracteres
String getTime(){
  time_t now = time(nullptr);
  struct tm timeinfo;
  gmtime_r(&now, &timeinfo);

  int year = timeinfo.tm_year + 1900;
  int month = timeinfo.tm_mon + 1;
  int day = timeinfo.tm_mday;
  int hour = timeinfo.tm_hour + 2;
  int min = timeinfo.tm_min;
  int sec = timeinfo.tm_sec;
  
  char timestamp[20];
  snprintf(timestamp, sizeof(timestamp), "%02d-%02d-%04d %02d:%02d:%02d", day, month, year, hour, min, sec);
  
  Serial.println(timestamp);

  return timestamp;
}
