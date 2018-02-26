#include <ESP8266WiFi.h>
#include <PubSubClient.h>

#define TOPICO_SUBSCRIBE  "/brewster/switch"
#define TOPICO_PUBLISH    "/brewster/switch/status"
#define ID_MQTT           "Brewser123"

const char* ssid = "JUN10R";
const char* password = "1154F6FF8A";
const char* mqtt_server = "iot.eclipse.org";
const int   mqtt_port = 1883;

const int   relayPin = D1;
const int   maxAttempt = 30;
const int   interval = 5000;

char msg[50];
int  currentState;

unsigned long timeLastMessage;

WiFiClient espClient;
PubSubClient client(espClient);


////////////////////////////////////////////////////////////////////////////////////////////
//                               SETUP                                                    //
////////////////////////////////////////////////////////////////////////////////////////////

void setup() {
  Serial.begin(9600);
  Serial.setTimeout(100);
  Serial.println("Wemos Started");

  // Configuracao de Pino do Relay
  pinMode(relayPin, OUTPUT);
  digitalWrite(relayPin, HIGH);
  currentState = HIGH;

  // Conecta ao WiFi
  connectToWiFi();

  // Configura o client para conexao ao Broker MQTT e define a funcao de callback quando recebe uma mensagem
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);

  // Define inicialmente o horario da primeira mensagem enviada
  timeLastMessage = millis();
}


////////////////////////////////////////////////////////////////////////////////////////////
//                               LOOP                                                     //
////////////////////////////////////////////////////////////////////////////////////////////

void loop() {
  if (!client.connected()) {
    mqtt_connect();
  }
  
  client.loop();

  enviaMensagemStatus();
}


////////////////////////////////////////////////////////////////////////////////////////////
//                            WIFI FUNCTIONS                                              //
////////////////////////////////////////////////////////////////////////////////////////////

boolean connectToWiFi(){
  int count = 1;

  Serial.print("Connecting to ");
  Serial.print(ssid);
  
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED && count < maxAttempt) {
    delay(1000);
    
    Serial.print(".");
    count++;

    if(count == maxAttempt){
      return false;
    }
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.print("Use this URL: http://");
  Serial.print(WiFi.localIP());
  Serial.println("/");

  return true;
}


////////////////////////////////////////////////////////////////////////////////////////////
//                            MQTT FUNCTIONS                                              //
////////////////////////////////////////////////////////////////////////////////////////////

void mqtt_connect() {
  while (!client.connected()) {
    if (client.connect(ID_MQTT)) {
      client.subscribe(TOPICO_SUBSCRIBE);
    } else {
      Serial.println("Erro ao conectar no Broker MQTT: ");
      Serial.print(client.state());
      delay(2000);
    }
  }
}

void callback(char* topic, byte* payload, unsigned int length) {
  // Limpa variavel de controle da mensagem
  memset(msg, 0, sizeof(msg));

  // Popula variavel de controle com dados recebidos da fila
  for (int i = 0; i < length; i++) {
    msg[i] = (char)payload[i];
  }

  // Exibe via serial o dado recebido para fins de depuracao
  Serial.println((String)msg);

  // Verifica a mensagem recebida. TURN_ON = Comando para ligar Relay. TURN_OFF = Comando para desligar Relay.
  if ((String)msg == "TURN_ON"){
      digitalWrite(relayPin, HIGH);
      currentState = HIGH;
      Serial.println("Relay Turned ON");
  } else if ((String)msg == "TURN_OFF"){
      digitalWrite(relayPin, LOW);
      currentState = LOW;
      Serial.println("Relay Turned OFF");
  }
}

void enviaMensagemStatus(){
  unsigned long currentTime = millis();

  if((currentTime - timeLastMessage) >= interval){
    if(digitalRead(relayPin) == HIGH){
      timeLastMessage = currentTime;
      client.publish(TOPICO_PUBLISH, "{ \"status\" : true }");
    } else {
      client.publish(TOPICO_PUBLISH, "{ \"status\" : false }");
    }
  }
}


