const uint16_t MQTT_PORT = 8883;
const char* MQTT_CLIENT_NAME = "TFG-1";
const char* MQTT_CLIENT_PASS = "1234";

const char client_private_key[] PROGMEM = R"EOF(-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDe/Hjr5oLj432K
Lr17Z0uDrqR64M8TDvYc4ut0sI3LaPZDhJ3nmQSLTCTXAahAJbksZlaPZQnT1hZD
ks7eGOf1H2Y3Try0T6VkhuVNEx7xmS6xHJ5G6aFhDGjf4NBuLx4HPYtE1okhFwXe
axIP+uN0CcRlV+ECBnRxGnCU22Ls8Yzpit5Uj+Rs3Syex0sOti7iHKrasbyTTqlD
cmNfK/jZ/pd+sJ/Xvh0m+G5rPq/N+NEmsFFPwnOJCd+neHd8jIcIwLRd4RzwQt7s
6XMKlzlFd1FOwgTKQSL2rvvLvUlK3u4A2iBHka1AWUwxPMIJSxOHkFboi2Qp0juC
yv6aw1+nAgMBAAECggEAEZxJ5oOO0cr9IVp9+iQsdBVpBbqseqUDWJZZTHQcdrSZ
l7fTtV9B2x3OiQZ8pbhKTrs0WeB7wrWqjiKm4NEsZzutbxpyT8vnKYXNJTr923ci
wg0bDkmpm52xyKtGJXWQ1GHkFlyFJE5frHMIpadwVZE8kq5lOwDh1a7mC5459Vwb
4gmnlHC/Y591F48AQDm0xKTpEy52lNRF7o/EeCvAoSJ3hWlSOcMRXDGTjEf4C5PQ
V5j51o/hso5AWA0fcNGsUCKd6FOlEemyqz4O0WqwemYWSUujCyVkpKVs5OVaDgGX
cw582tkYSE14A+b1zt00RllOH8WXIcX4/C71Hi31IQKBgQD6gvk73Z9nAXt6xL7p
QiqqQ5iheegpH2do5o0dOtInOKtKJ7FyYyVI5fHc05vfnZt6KFqCwcgoZT7W5dwW
TAVK1ANyVRJY7b2WXXgNNGvFS2QfPfF2P+c4aaLlfGlUfza+LFqAWPijOH2doR4F
JzhPX3xB86OQGw5dZEp3f+f44QKBgQDj3x58BU/obPrt/J4b2bhau8NNbFFubNzE
80VTM+D2o/u3UtEhlK6zf4W2OZgQa2UEuFlhIzbcmTDBRU0rOP80Iw1mBy5etBAV
GXfXV34Q1CKtA57oAkvhO+MdgcpVnysLnhhOTBB9CCBAZ26B5th8iw2vsME0UJeQ
GHRHkv5BhwKBgQCVHg+D3jl7lDtPafwGV3eUIGajgDB9Ag+JNuu7AX+FD0uO+a+7
2l6gVRgyjdfUNToObiTqfrVJrnLIcs0ejKP91dQzY4ZnXyUic4L5wUGBkI4JttKb
xBA72U248uS0AoGwlDBPBCcE6aSEhxqakK0JOlp527B6IFDdsMxO89k+oQKBgQDV
mhvgU7ZxAF9D4Q5wuukmHGXZ2JSIt4FHGWc9tB7H9DWLxhUFrnMJDZvQkjJqCdG6
1/fop3LQ3MSoFwdcYeRQAh+YKVkdKxr8PFBrSreAnOoYVpGJmEV6z4F48mYxVq+q
BztvgbvfCFP7KzmaiUMbk9lzfHPPT1CToWi2gyLVVwKBgFw9XM5zGPZdPBhlqdFo
nbTG74lCJDrcfsROpk4F/zP9AQof+mSMRdcuadoS225/RQDUVxCHEfkyqXRWeeE5
IwFbXMjToL1yHpmkNJD0WJXcSQ5Ja22iWntXmRw90TkPWcmJ3erAqXzt+5FKdsV6
dmsX6qwKSmEsV1JgOvcM6d5c
-----END PRIVATE KEY-----
)EOF";

const char client_cert[] PROGMEM = R"EOF(-----BEGIN CERTIFICATE-----
MIIDmzCCAoMCFDDAfpnMKw6AS6vP2mAbh9o5ywt3MA0GCSqGSIb3DQEBCwUAMIGD
MQswCQYDVQQGEwJTUDEPMA0GA1UECAwGTWFkcmlkMQ8wDQYDVQQHDAZNYWRyaWQx
DzANBgNVBAoMBk9SR19DQTEUMBIGA1UECwwLT1JHX0NBX1VOSVQxEjAQBgNVBAMM
CWxvY2FsaG9zdDEXMBUGCSqGSIb3DQEJARYIY2FAY2EuZXMwHhcNMjMwNjEzMTcw
NDIzWhcNMjQwNjA3MTcwNDIzWjCBjzELMAkGA1UEBhMCU1AxDzANBgNVBAgMBk1h
ZHJpZDEPMA0GA1UEBwwGTWFkcmlkMRMwEQYDVQQKDApPUkdfQ0xJRU5UMRgwFgYD
VQQLDA9PUkdfQ0xJRU5UX1VOSVQxDjAMBgNVBAMMBVRGRy0xMR8wHQYJKoZIhvcN
AQkBFhBjbGllbnRAY2xpZW50LmVzMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIB
CgKCAQEA3vx46+aC4+N9ii69e2dLg66keuDPEw72HOLrdLCNy2j2Q4Sd55kEi0wk
1wGoQCW5LGZWj2UJ09YWQ5LO3hjn9R9mN068tE+lZIblTRMe8ZkusRyeRumhYQxo
3+DQbi8eBz2LRNaJIRcF3msSD/rjdAnEZVfhAgZ0cRpwlNti7PGM6YreVI/kbN0s
nsdLDrYu4hyq2rG8k06pQ3JjXyv42f6XfrCf174dJvhuaz6vzfjRJrBRT8JziQnf
p3h3fIyHCMC0XeEc8ELe7OlzCpc5RXdRTsIEykEi9q77y71JSt7uANogR5GtQFlM
MTzCCUsTh5BW6ItkKdI7gsr+msNfpwIDAQABMA0GCSqGSIb3DQEBCwUAA4IBAQAP
4+RaKNmUmJZZLuVJNy/rro04nMh//dci1E1w5iZeb5pHBDwicvteUOVyrkhDEEkX
sM8gITGp9L10KsCp01v8CgjK1cPgBlFFBAlByg0ER/VcXkoyKR9oGsGBJlwSmQvz
1yDjDG4V/CvO2Bt9OthA+DtQzYx8EZsR9jnWCvyS4jScn2reS69wuXg2lpPQMada
Vq1sF35GR9Id4OaZNkV+MKnLhu3e/hinmAliYjo7HgndP5g+kb/rR8pKujwxXiSZ
qWyu3BIunq0gY7wW2agAMh9nCzXfQnihi+DAmf8KWrDD/v0PgFWw1F6mjK8LDXlg
jbEpHxAduk1Zsmsx9Lj2
-----END CERTIFICATE-----
)EOF";

const char ca_cert[] PROGMEM = R"EOF(-----BEGIN CERTIFICATE-----
MIID6TCCAtGgAwIBAgIUB256qBeODIYkFawYT5duSKPFexgwDQYJKoZIhvcNAQEL
BQAwgYMxCzAJBgNVBAYTAlNQMQ8wDQYDVQQIDAZNYWRyaWQxDzANBgNVBAcMBk1h
ZHJpZDEPMA0GA1UECgwGT1JHX0NBMRQwEgYDVQQLDAtPUkdfQ0FfVU5JVDESMBAG
A1UEAwwJbG9jYWxob3N0MRcwFQYJKoZIhvcNAQkBFghjYUBjYS5lczAeFw0yMzA2
MTMxNjU5NDlaFw0yODA2MTIxNjU5NDlaMIGDMQswCQYDVQQGEwJTUDEPMA0GA1UE
CAwGTWFkcmlkMQ8wDQYDVQQHDAZNYWRyaWQxDzANBgNVBAoMBk9SR19DQTEUMBIG
A1UECwwLT1JHX0NBX1VOSVQxEjAQBgNVBAMMCWxvY2FsaG9zdDEXMBUGCSqGSIb3
DQEJARYIY2FAY2EuZXMwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDE
y6fcqj9qe9fum10jcIX5YrwnFfE58X6696MFbNRVJSMRTW2wSeqSjxL4ZBEJ3Gj4
pAC0MYUxOXOlFXCLB6Uxq4K6anKZmhGEAOwwCCIWKs4ezfo/X/e2lIQLO/BzvrCa
hgx7vB8RJCsMmKmWkAfYbkMn8NS3qvC4t4mdKJZO/afpONCzb8bBggUQuaKxnwXb
VXneSMcWnfPNG5hyYGT7RWr66o8xFY9ptMFQe8l3zJwKJdjoRBfULh2UJvnBw6Lt
eQ/CJEoGO0PlwENEhLdBxUTitJVdIwOszf6KWsAhDS6h3Ngbyek45wARwRySxU+S
Knbzb2ssKlcMydwr4ivZAgMBAAGjUzBRMB0GA1UdDgQWBBRs7suUd3gmUkjnSLYu
mZehNCsXAzAfBgNVHSMEGDAWgBRs7suUd3gmUkjnSLYumZehNCsXAzAPBgNVHRMB
Af8EBTADAQH/MA0GCSqGSIb3DQEBCwUAA4IBAQBKP/ZoDaUS20jO4COj6UPhrfgD
YK4XSJeHKWt5bM/DKOry/pChSD4GB2pGxE9GhuA77kq2gvdcpNrXXi4dq99e4Th8
85yp65By15MS1e8JaZc+kjr+z80nYxJvRrZ13dnqRr9OsJHQJUYS0ku99VTkzPV+
dWhJGDY+jMO0W7c56/clUVr6lgeY1BatNGOgbfqPvaOPAs8AxJAT+lBapd52waq+
Zlz6fufr9YJEcvsSZFlf3ywUrBl1ZXDxEGMvjeSfQsn6ZBVQ2H0W5sDr0zg2fkvF
xaf+ymosKx54wopYTreQSJvnRP6q34s3MNf5hUc/YMG+F3vh0QKvuo2w/Ldo
-----END CERTIFICATE-----
)EOF";

BearSSL::WiFiClientSecure espClient;
PubSubClient client(espClient);

// Suscribe al tema "TFG/TFG-1" en MQTT
void SuscribeMqtt()
{
	client.subscribe("TFG/TFG-1");
}

String payload;

// Publica datos en MQTT
void PublishMqtt(String data)
{
	payload = "";
	payload = String(data);
  
	client.publish("TFG/TFG-1", (char*)payload.c_str());
  Serial.println(" data publicada... ");
}

String content = "";

// Función de callback para procesar mensajes recibidos en MQTT
void OnMqttReceived(char* topic, byte* payload, unsigned int length) 
{
	Serial.print("Received on ");
	Serial.print(topic);
	Serial.print(": ");

	content = "";	
	for (size_t i = 0; i < length; i++) {
		content.concat((char)payload[i]);
	}
	Serial.print(content);
	Serial.println();
}