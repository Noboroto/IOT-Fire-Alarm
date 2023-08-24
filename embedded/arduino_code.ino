#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include "DHT.h"
#include <ESP8266WiFi.h>
#include <PubSubClient.h>

// Khai báo các pin trên board
#define Dig0 16
#define Dig1 5
#define Dig2 4
#define Dig3 0
#define Dig4 2
#define Dig5 14
#define Dig6 12
#define Dig7 13
#define Dig8 15

#define TX_PIN 1
#define RX_PIN 3

// Khai báo pin của các thiết bị
#define RED_PIN Dig0
#define YELLOW_PIN TX_PIN
#define GREEN_PIN RX_PIN
#define BUTTON_PIN Dig6
#define BUZZER_PIN Dig7
#define GAS_PIN Dig4
#define FLAME_PIN Dig5
#define DHT_PIN Dig3

#define EMERGENCY_OFF 0
#define EMERGENCY_BY_BUTTON 1
#define EMERGENCY_BY_SENSOR 2
#define EMERGENCY_BY_USER 3

// Wi-fi config
#ifndef STASSID
#define STASSID "HCMUS-C22"
#define STAPSK "phonghoc@c22"
#endif

const char *ssid = STASSID;
const char *password = STAPSK;

// MQTT config
const char *mqttServer = "broker.hivemq.com";
int port = 1883;
WiFiClient wifiClient;
PubSubClient mqttClient(wifiClient);

// LCD
LiquidCrystal_I2C lcd(0x27, 20, 4);
// Buzzer
float sinVal = (sin(10 * (3.1412 / 180)));
int toneVal = 2000 + (int(sinVal * 1000));
// DHT 11
DHT dht(DHT_PIN, DHT11);
// Kiểm tra nút có được nhấn hay không?
int countPress = 0;     // số lần button được nhấn
int buttonState = 0;    // trạng thái hiện tại của button
int lastButtonState = 0; // trạng thái trước đó của button
unsigned int lastMillis = 0;

void lcdPrint(String str)
{
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print(str);
}

void wifiConnect()
{
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    lcdPrint("Connecting to " + String(ssid));
    delay(500);
  }
  lcdPrint("Connected to " + String(ssid));
}

void mqttConnect()
{
  while (!mqttClient.connected())
  {
    String clientId = "ESP8266Client-david0403-";
    clientId += String(random(0xffff), HEX);
    if (mqttClient.connect(clientId.c_str()))
    {
      lcdPrint("MQTT Connected");
      mqttClient.subscribe("21127469/press_emergency");
    }
    else
    {
      lcdPrint("MQTT Connect failed");
      delay(5000);
    }
  }
}

void changeEmergencyState(int sender);

// MQTT Receiver
void callback(char *topic, byte *message, unsigned int length)
{
  String strMsg;
  for (int i = 0; i < length; i++)
  {
    strMsg += (char)message[i];
  }

  //***Code here to process the received package***
  if (!strcmp(topic, "21127469/press_emergency"))
  {
    changeEmergencyState(EMERGENCY_BY_USER);
  }
}

float readTemp()
{
  // trả về nhiệt độ ở độ Celcius
  return dht.readTemperature();
}

float readHumid()
{
  // trả về độ ẩm
  return dht.readHumidity();
}

int isGas()
{
  bool gas = digitalRead(GAS_PIN);
  // Cảm biến gas trả về False khi phát hiện gas và ngược lại nên điều này dễ gây nhầm lẫn. Vì vậy trả về "!gas" để tránh nhầm lẫn!!!
  return !gas;
}

bool isFlame()
{
  bool flame = digitalRead(FLAME_PIN);
  // Cảm biến lửa trả về False khi phát hiện lửa và ngược lại nên điều này dễ gây nhầm lẫn. Vì vậy trả về "!flame" để tránh nhầm lẫn!!!
  return !flame;
}

// Nếu trạng thái là nguy hiểm thì trả về PIN của đèn RED_PIN, trạng thái báo động thì trả về PIN của đèn YELLOW_PIN, trạng thái an toàn trả về PIN của đèn GREEN_PIN
int checkState(float temperature, float humid, bool hasGas, bool hasFlame)
{
  // có lửa thì đèn đỏ
  if (hasFlame)
    return RED_PIN;
  // phát hiện Gas và nhiệt độ lớn hơn 80 độ C thì đèn đỏ
  if (hasGas && temperature > 80)
    return RED_PIN;
  // phát hiện có Gas hoặc nhiệt độ lớn 60 độ C thì đèn vàng
  if(hasGas || temperature > 60)
    return YELLOW_PIN;
  // Nhiệt độ lớn hơn 40 độ C và độ ẩm thấp hơn 30%
  if(temperature > 40 && humid < 30)
    return YELLOW_PIN;
  return GREEN_PIN;
}

void changeEmergencyState(int sender)
{
  countPress++;
  countPress %= 2;
  // Số lần bấm nút là lẻ thì bật chế độ báo động
  if (countPress % 2 != 0)
  {
    mqttClient.publish("21127469/emergency", String(sender).c_str());
    digitalWrite(RED_PIN, HIGH);
    tone(BUZZER_PIN, toneVal);
    digitalWrite(GREEN_PIN, LOW);
    digitalWrite(YELLOW_PIN, LOW);
  }
  // Số lần bấm là chẵn thì tắt chế độ này
  else
  {
    mqttClient.publish("21127469/emergency", String(EMERGENCY_OFF).c_str());
    digitalWrite(RED_PIN, LOW);
    noTone(BUZZER_PIN);
  }
}

void print_to_lcd(int state, float temperature, bool hasGas, bool hasFlame)
{
  // Thông điệp
  if ((millis() - lastMillis) < 1000)
    return;
  lastMillis = millis();
  lcd.clear();
  String t = "Temp: " + String(temperature, 2);
  String g = "Gas: ";
  String f = "Flame: ";
  String s = "State: ";
  
  if(hasGas){
    g = "Gas: FOUND";}
  else
    g = "Gas: NOT FOUND";

  if(hasFlame){
    f = "FLame: FOUND";}
  else
    f = "FLame: NOT FOUND";

  if (state == RED_PIN)
    s = "State: DANGEROUS";
  else if (state == YELLOW_PIN)
    s = "State: WARNING";
  else
    s = "State: OK";

  lcd.setCursor(0, 0);
  lcd.print(s);
  lcd.setCursor(0, 1);
  lcd.print(t);
  lcd.setCursor(0, 2);
  lcd.print(g);
  lcd.setCursor(0, 3);
  lcd.print(f);
}

void setup()
{
  pinMode (FLAME_PIN, INPUT);
  pinMode (GAS_PIN, INPUT);
  pinMode(BUTTON_PIN, INPUT);
  pinMode(RED_PIN, OUTPUT);
  pinMode(GREEN_PIN, OUTPUT);
  pinMode(YELLOW_PIN, OUTPUT);
  // LCD 20x4
  lcd.init();       //Khởi động màn hình. Bắt đầu cho phép Arduino sử dụng màn hình
  lcd.backlight();   //Bật đèn nền
  lcd.noCursor();
  // dht11 sensor
  dht.begin();

  wifiConnect(); 
  mqttClient.setServer(mqttServer, port);
  mqttClient.setCallback(callback);
  mqttClient.setKeepAlive(90);
  lastMillis = millis();
}

void sendDataToMQTT(float temperature, bool isGasAppear, bool isFlameAppear)
{
  if (isnan(temperature)) temperature = 0;
  mqttClient.publish("21127469/temperature", String(temperature).c_str());
  mqttClient.publish("21127469/gas", String(isGasAppear ? 1 : 0).c_str());
  mqttClient.publish("21127469/flame", String(isFlameAppear ? 1 : 0).c_str());
}

void loop()
{
  // put your main code here, to run repeatedly:
  if (!mqttClient.connected())
  {
    mqttConnect();
  }
  mqttClient.loop();

  float temp = readTemp();
  float humid = readHumid();
  bool gas = isGas();
  bool flame = isFlame();
  if ((millis() - lastMillis) >= 500)
    sendDataToMQTT(temp, gas, flame);

  int state = checkState(temp, humid, gas, flame);
  if(countPress % 2 == 0)
  {
    // Nếu trạng thái nguy hiểm thì bật đèn đỏ, tắt các đèn còn lại và cho buzzer kêu tới khi an toàn
    if (state == RED_PIN)
    {
      changeEmergencyState(EMERGENCY_BY_SENSOR);
    }
    // Nếu trạng thái cảnh báo, sẽ bật đèn vàng và tắt các đèn khác, cho buzzer kêu trong 3s
    else if (state == YELLOW_PIN)
    {
      digitalWrite(RED_PIN, LOW);
      digitalWrite(YELLOW_PIN, HIGH);
      digitalWrite(GREEN_PIN, LOW);
    }
    // Trạng thái an toàn thì bật đèn xanh, các đèn khác tắt, buzzer không kêu
    else if (state == GREEN_PIN)
    {
      digitalWrite(YELLOW_PIN, LOW);
      digitalWrite(RED_PIN, LOW);
      digitalWrite(GREEN_PIN, HIGH);
    }
  }

  int buttonState = digitalRead(BUTTON_PIN);
  // Kiểm tra số lần bấm nút, đè nút thì vẫn chỉ tính là 1 lần bấm nút
  // Nếu buzzer đang reo không phải do bấm thì việc bấm nút sẽ không tính là một lần bấm
  if (buttonState != lastButtonState & buttonState > 0) 
  {
    changeEmergencyState(EMERGENCY_BY_BUTTON);
  }
  lastButtonState = buttonState;

  print_to_lcd(state, temp, gas, flame);
}
