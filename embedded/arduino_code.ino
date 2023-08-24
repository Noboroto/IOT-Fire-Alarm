#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include "DHT.h"
#include <ESP8266WiFi.h>
#include <PubSubClient.h>

// Khai báo pin của các thiết bị
#define RED 16 //D0
#define YELLOW 1 //Tx
#define GREEN 3 //Rx
#define BUTTON 12 //D6
#define BUZZER 13 // D7
#define GAS 2 // D4
#define FLAME 14 //D5
#define DHT_PIN 0 //D3

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
int count_press = 0;     // số lần button được nhấn
int button_state = 0;    // trạng thái hiện tại của button
int lastButtonState = 0; // trạng thái trước đó của button
unsigned int last_milis = 0;

void wifiConnect()
{
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void mqttConnect()
{
  while (!mqttClient.connected())
  {
    Serial.println("Attemping MQTT connection...");
    String clientId = "ESP8266Client-david0403-";
    clientId += String(random(0xffff), HEX);
    if (mqttClient.connect(clientId.c_str()))
    {
      Serial.println("connected");
      mqttClient.subscribe("21127469/remoteemergency");
    }
    else
    {
      Serial.println("try again in 5 seconds");
      delay(5000);
    }
  }
}

void on_off_emergency_state();

// MQTT Receiver
void callback(char *topic, byte *message, unsigned int length)
{
  Serial.println(topic);
  String strMsg;
  for (int i = 0; i < length; i++)
  {
    strMsg += (char)message[i];
  }
  Serial.println(strMsg);

  //***Code here to process the received package***
  if (!strcmp(topic, "21127469/remoteemergency"))
  {
    on_off_emergency_state();
  }
}

float readTemp()
{
  // trả về nhiệt độ ở độ Celcius
  return dht.readTemperature();
}

float readHumid()
{
  // trả về độ ẩm trong không khí(%)
  return dht.readHumidity();
}

int isGas()
{
  bool gas = digitalRead(GAS);
  // Cảm biến gas trả về False khi phát hiện gas và ngược lại nên điều này dễ gây nhầm lẫn. Vì vậy trả về "!gas" để tránh nhầm lẫn!!!
  return !gas;
}

bool isFlame()
{
  bool flame = digitalRead(FLAME);
  // Cảm biến lửa trả về False khi phát hiện lửa và ngược lại nên điều này dễ gây nhầm lẫn. Vì vậy trả về "!flame" để tránh nhầm lẫn!!!
  return !flame;
}

// Nếu trạng thái là nguy hiểm thì trả về PIN của đèn RED, trạng thái báo động thì trả về PIN của đèn YELLOW, trạng thái an toàn trả về PIN của đèn GREEN
int check_state(float temp, float humid, bool Gas, bool Flame)
{
  // có lửa thì đèn đỏ
  if (Flame)
    return RED;
  // phát hiện Gas và nhiệt độ lớn hơn 80 độ C thì đèn đỏ
  if (Gas && temp > 80)
    return RED;
  // phát hiện có Gas hoặc nhiệt độ lớn 60 độ C thì đèn vàng
  if(Gas || temp > 60)
    return YELLOW;
  // Nhiệt độ lớn hơn 40 độ C và độ ẩm thấp hơn 30%
  if(temp > 40 && humid < 30)
    return YELLOW;
  return GREEN;
}

void on_off_emergency_state()
{
  count_press++;
  count_press %= 2;
  // Số lần bấm nút là lẻ thì bật chế độ báo động
  if (count_press % 2 != 0)
  {
   // mqttClient.publish("21127469/emergency", "True");
    // Serial.println("Buzzer");
    digitalWrite(RED, HIGH);
    // Serial.println("haha");
    tone(BUZZER, toneVal);
    digitalWrite(GREEN, LOW);
    digitalWrite(YELLOW, LOW);
  }
  // Số lần bấm là chẵn thì tắt chế độ này
  else
  {
    // Serial.println("hoho");
    //mqttClient.publish("21127469/emergency", "False");
    digitalWrite(RED, LOW);
    noTone(BUZZER);
  }
}

void print_to_lcd(int state, float temp, bool Gas, bool Flame)
{
  // Thông điệp
  if ((millis() - last_milis) < 1000)
    return;
  last_milis = millis();
  lcd.clear();
  String t = "Temp: " + String(temp, 2);
  String g = "Gas: ";
  String f = "Flame: ";
  String s = "State: ";
  
  if(Gas){
    g = "Gas: FOUND";}
  else
    g = "Gas: NOT FOUND";

  if(Flame){
    f = "FLame: FOUND";}
  else
    f = "FLame: NOT FOUND";

  if (state == RED)
    s = "State: DANGEROUS";
  else if (state == YELLOW)
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
  Serial.begin(9600);
  // put your setup code here, to run once:
  pinMode (FLAME, INPUT);
  pinMode (GAS, INPUT);
  pinMode(BUTTON, INPUT);
  // pinMode (BUZZER, OUTPUT);
  pinMode(RED, OUTPUT);
  pinMode(GREEN, OUTPUT);
  pinMode(YELLOW, OUTPUT);
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
  last_milis = millis();
}

void sendDataToMQTT(float temp, bool isGasAppear, bool isFlameAppear)
{
  if (isnan(temp)) temp = 0;
  mqttClient.publish("21127469/temperature", String(temp).c_str());
  mqttClient.publish("21127469/gas", String(isGasAppear ? 1 : 0).c_str());
  mqttClient.publish("21127469/flame", String(isFlameAppear ? 1 : 0).c_str());
}

// Cơ chế hoạt động: nếu buzzer kêu vì cảm biến phát hiện nguy hiểm thì việc nhấn nút sẽ không thể tác động đến buzzer, nghĩa là buzzer sẽ chỉ ngừng kêu khi cảm biến thấy không còn nguy hiểm
// Còn nếu buzzer kêu vì nhấn nút thì chỉ tắt được khi nhấn nút thêm 1 lần nữa.
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
  if ((millis() - last_milis) >= 500)
    sendDataToMQTT(temp, gas, flame);


  int state = check_state(temp, humid, gas, flame);
  if(count_press % 2 == 0)
  {
    // Nếu trạng thái nguy hiểm thì bật đèn đỏ, tắt các đèn còn lại và cho buzzer kêu tới khi an toàn
    if (state == RED)
    {
      on_off_emergency_state();
      digitalWrite(RED, HIGH);
      digitalWrite(YELLOW, LOW);
      digitalWrite(GREEN, LOW);
      //tone(BUZZER, toneVal);
    }
    // Nếu trạng thái cảnh báo, sẽ bật đèn vàng và tắt các đèn khác, cho buzzer kêu trong 3s
    else if (state == YELLOW)
    {
      digitalWrite(YELLOW, HIGH);
      digitalWrite(RED, LOW);
      digitalWrite(GREEN, LOW);
      //tone(BUZZER, toneVal, 3000);
    }
    // Trạng thái an toàn thì bật đèn xanh, các đèn khác tắt, buzzer không kêu
    else if (state == GREEN)
    {
      digitalWrite(YELLOW, LOW);
      digitalWrite(RED, LOW);
      digitalWrite(GREEN, HIGH);
      //notTone(BUZZER);
    }
  }

  int button_state = digitalRead(BUTTON);
  // Kiểm tra số lần bấm nút, đè nút thì vẫn chỉ tính là 1 lần bấm nút
  // Nếu buzzer đang reo không phải do bấm thì việc bấm nút sẽ không tính là một lần bấm
  if (button_state != lastButtonState & button_state > 0) 
  {

    on_off_emergency_state();
  }
  lastButtonState = button_state;
  Serial.println("Tester");
 
  print_to_lcd(state, temp, gas, flame);
  //Serial.println(count_press);
}
