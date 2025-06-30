
#include <WiFi.h> //lets esp32 connect to wifi
#include <HTTPClient.h> //used for sending HTTP requests
#include <PubSubClient.h> //lets esp32 publish/subscribe using MQTT protocol
#include <ESP32Servo.h> //lets esp32 control servo motors


//Defining widi and MQTT credentials
const char* ssid = "galaxy"; //wifi ssid
const char* pswrd = "06031957"; //wifi password
const char* mqtt_server = "10.0.0.53"; //ip address for mqtt

//Define pins of peripherals
const int tempPin = 32;
const int presPin = 33;
const int airPin = 12;
const int lightPin = 14;


Servo myServo; //create a servo object to control a servo motor
int servoPin = 13; //the servo motor's signal line is connected ot GPIO 13

//Setup Wifi and MQTT client
WiFiClient espClient;  //create a wifi client object for basic network communication
PubSubClient client(espClient); //create an mqtt client using the wifi client
//client is the MQTT interface, built on top of the espClient. This allows you to connect to the MQTT broker and publish/subscribe to topics
//For example, let's say you want the esp32 to read a temperature sensor and send that reading to a cloud dashboard. You 
//need a way to connect to wifi (espClient), and a way to send the messages over that connection using MQTT (client)

void setup_wifi(){
    delay(10);
    Serial.print("Connecting to ");
    Serial.println(ssid); //prints name of wifi it's connecting to

    WiFi.begin(ssid, pswrd); //start connecting to WiFi with the given credentials

    while (WiFi.status() != WL_CONNECTED) { //while still connecting
        delay(500);
        Serial.print(".");
    }
    Serial.print("");
    Serial.println("WiFi connected");
    
    }

//goal of reconnect() is to try to connect to MQTT broker if it's not connected. Once connected, subscribe to a topic (esp/cmd) so the 
//esp32 can receive commands
void reconnect() {
    //If the client (esp32) is not connected, enter this loop
    while(!client.connected()) {
        Serial.print("Attempting MQTT connection...");
        //Attempt to connect to the MQTT broker using the name "ESP32Client"
        if(client.connect("ESP32Client")){
            Serial.println("connected");

            //subscribe to the topic from the broker
            client.subscribe("esp/cmd");
        }
        else {
            //what to do in case connection to MQTT broker fails
            Serial.print("failed, rd=");
            Serial.print(client.state());
            Serial.println(" try again in 5 seconds");
            delay(5000);
        }
        }
        }

    //this function is called automatically whenever the esp32 receives a message from mqtt broker
    //this function is like the esp32's inbox. it receives MQTT messages, decodes them, and called parseStr to act on the commands
    //this also filters messages by topic, to make sure the esp32 only acts on commands in its topic.
    void callback(char * topic, byte * payload, unsigned int length){
    //topic is the topic name, payload is the actually message data, length is how long the message is
        String message;
        for(int i=0; i < length; i++){
            message += (char)payload[i];
            //the payload comes in as raw bytes. this loops converts it to a readable string
        }
        Serial.println(message);
        //prints the message in string form to the serial monitor 
        
        // Checks if the incoming messages came from the topic "esp/cmd", which is the topic the esp32 subscribed to
    
        if (String(topic) == "esp/cmd"){
            Serial.println("Received message: " + message);
            parseStr(message);
            //call parseStr to interpet and act on the command
        }
    }

    
    //this function interprets the message received via MQTT and tell the esp32 what to do
    //it takes a string argument and parses it to decipher what the command is saying to do
    void parseStr(const String& str) {
        // find the index of the comma so we know where to split the string
        int commaIndex = str.indexOf(',');
      
        // Extract the sensor name and value (on or off)
        String sensorName = str.substring(0, commaIndex);
        int pinState = str.substring(commaIndex + 1).toInt();
        Serial.println("sensorName-> " + sensorName + ", pinState-> " + pinState);
      
        // Take action based on sensor name
        //turns the tempPin, presPin, or lightPin high/low depending on the input pinState
        //depending on the air sensor input pinState, turns the servo motor on/off
        if (sensorName == "temperature") {
          digitalWrite(tempPin, pinState);
        } else if (sensorName == "pressure") {
          digitalWrite(presPin, pinState);
        } else if (sensorName == "air") {
          //digitalWrite(airPin, pinState);
          run_servo(pinState);
        } else if (sensorName == "light") {
          digitalWrite(lightPin, pinState);
        } else {
          // Handle unknown sensor names if needed
        }
      }

      //runs once when the board powers or resets
      void setup() {
        Serial.begin(115200); //baud rate
        setup_wifi(); //connects esp32 to the wifi using the ssid and password given earlier
        client.setServer(mqtt_server, 1883); //sets the destination broker using ip address and port number
        client.setCallback(callback); //says when a messages comes in from the broker on a topic I subscribed to, call the callback() function. this is how esp32 knows what to do with incoming messages

      
        myServo.attach(servoPin); // attach servo
        // set the peripheral pins as outputs
        pinMode(tempPin, OUTPUT);
        pinMode(presPin, OUTPUT);
        pinMode(airPin, OUTPUT);
        pinMode(lightPin, OUTPUT);
      
      }
      
      void loop() {
        // put your main code here, to run repeatedly:
        if(!client.connected()){
          reconnect();
        }
        client.loop();
      
        //run_servo();
      
        // Simulate sensor reading
        // float temperature = 25.0 + (rand() % 100) / 10.0;
        float temperature = random(0, 100) + random(0, 100) / 100.0; 
        float pressure = random(0, 1000) + random(0, 100) / 100.0; 
        float airQuality = random(0, 500) + random(0, 100) / 100.0; 
        float light = random(0, 100) + random(0, 100) / 100.0; 
        // String temp_str = String(temperature);
      
         // Combine all sensor values into a single comma-separated string using String()
        String payload = String(temperature) + "," + 
                         String(pressure) + "," + 
                         String(airQuality) + "," + 
                         String(light);
      
        // publish temperature to MQTT topic
        // client.publish("h/l/t", temp_str.c_str());
        client.publish("home/sensors/data", payload.c_str());
        Serial.print("Sensor data sent4: ");
        Serial.println(payload);
      
        delay(5000); // Publish every 5 seconds
      
      }
      
      void run_servo(int value){
        if (value == 0){
           myServo.write(0);
        } else {
          myServo.write(180);
          //delay(1000);
        }
      
      }

    


    

