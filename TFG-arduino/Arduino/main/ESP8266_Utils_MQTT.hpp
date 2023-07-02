//Configura el servidor Mqtt
void InitMqtt() 
{
  BearSSL::X509List *serverTrustedCA = new BearSSL::X509List(ca_cert);
  BearSSL::X509List *serverCertList = new BearSSL::X509List(client_cert);
  BearSSL::PrivateKey *serverPrivKey = new BearSSL::PrivateKey(client_private_key);
  espClient.setTrustAnchors(serverTrustedCA);
  espClient.setClientRSACert(serverCertList, serverPrivKey);
  setClock();
  client.setServer(mqttServer, MQTT_PORT);
}

//Conexión al servidor Mqtt
void ConnectMqtt()
{
  char err_buf[256];
	while (!client.connected())
	{
		Serial.println("Starting MQTT connection...");
    String clientId = "TFG-1";
    
		if (client.connect(clientId.c_str()))
		{
      Serial.println("MQTT connected");
			SuscribeMqtt();
		}
		else
		{
			Serial.print("failed, rc = ");
      Serial.println(client.state());
      espClient.getLastSSLError(err_buf, sizeof(err_buf));
      Serial.print("SSL error: ");
      Serial.println(err_buf);
      Serial.println("try again in 5 seconds");

			delay(5000);
		}
	}
}

//Bucle de conexión al servidor Mqtt
void HandleMqtt()
{
	if (!client.connected())
	{
		ConnectMqtt();
	}
	client.loop();
}
