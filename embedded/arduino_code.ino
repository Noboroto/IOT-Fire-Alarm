
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include "DHT.h"
// Khai báo pin của các thiết bị
#define RED 0
#define YELLOW 2
#define GREEN 14
#define BUTTON 12
#define BUZZER 13
#define GAS 5
#define FLAME 
#define DHT_PIN 4

// LCD
LiquidCrystal_I2C lcd(0x27,20,4);
// Buzzer
float sinVal = (sin(10*(3.1412/180)));
int toneVal = 2000+(int(sinVal*1000));
// DHT 11
DHT dht(DHT_PIN, DHT11);
// Kiểm tra nút có được nhấn hay không?
int count_press = 0;   // số lần button được nhấn
int button_state = 0;         // trạng thái hiện tại của button
int lastButtonState = 0;     // trạng thái trước đó của button



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
/*
bool isFlame()
{
  bool flame = digitalRead(FLAME);
  // Cảm biến lửa trả về False khi phát hiện lửa và ngược lại nên điều này dễ gây nhầm lẫn. Vì vậy trả về "!flame" để tránh nhầm lẫn!!!
  return !flame;
}

// Nếu trạng thái là nguy hiểm thì trả về PIN của đèn RED, trạng thái báo động thì trả về PIN của đèn YELLOW, trạng thái an toàn trả về PIN của đèn GREEN
int check_state()
{
  // Đọc các sensor
  float temp = readTemp();
  float humid = readHumid();
  bool Gas = isGas();
  bool Flame = isFlame();
  // có lửa thì đèn đỏ
  if (Flame)
    return RED;
  // phát hiện Gas và nhiệt độ lớn hơn 80 độ C thì đèn đỏ
  if (Gas && temp > 80)
    return RED;
  // phát hiện có Gas hoặc nhiệt độ lớn 60 độ C thì đèn vàng
  if(GAS || temp > 60)
    return YELLOW;
  // Nhiệt độ lớn hơn 40 độ C và độ ẩm thấp hơn 30%
  if(temp > 40 && humid < 30)
    return YELLOW;
  return GREEN
}*/

void on_off_emergency_state()
{
  // Số lần bấm nút là lẻ thì bật chế độ báo động
  if(count_press % 2 != 0)
  {
    //Serial.println("Buzzer");
    digitalWrite(RED, HIGH);
    //Serial.println("haha");
    tone(BUZZER, toneVal);
    digitalWrite(GREEN, LOW);
    digitalWrite(YELLOW, LOW);
  }
  // Số lần bấm là chẵn thì tắt chế độ này
  else
  {
    //Serial.println("hoho");
    digitalWrite(RED, LOW);
    digitalWrite(YELLOW, LOW);
    noTone(BUZZER);
    digitalWrite(GREEN, HIGH);
  }
}

/*void print_to_lcd()
{
  // Đọc các sensor
  float temp = readTemp();
  bool Gas = isGas();
  bool Flame = isFlame();
  int state = check_state();
  // Thông điệp
  String t = "Temp: " + String(temp, 2);
  String g = "Gas: ";
  String f = "Flame: ";
  String s = "State: ";

  if(Gas)
    g += "FOUND";
  else
    g += "NOT FOUND";
  
  if(Flame)
    f += "FOUND";
  else
    f += "NOT FOUND";

  if (state == RED)
    s += "DANGEROUS";
  else if (state == YELLOW)
    s += "WARNING";
  else
    s += "OK";

  lcd.setCursor(0, 0);
  lcd.print(s);
  lcd.setCursor(0, 1);
  lcd.print(t);
  lcd.setCursor(0, 2);
  lcd.print(g);
  lcd.setCursor(0, 3);
  lcd.print(f);
}*/

void setup() {
  Serial.begin(9600);
  // put your setup code here, to run once:
  //pinMode (FLAME, INPUT);
  //pinMode (GAS, INPUT);
  pinMode (BUTTON, INPUT);
  //pinMode (BUZZER, OUTPUT);
  pinMode (RED, OUTPUT);
  pinMode (GREEN, OUTPUT);
  pinMode (YELLOW, OUTPUT);
  // LCD 20x4
  /*lcd.init();       //Khởi động màn hình. Bắt đầu cho phép Arduino sử dụng màn hình
  lcd.backlight();   //Bật đèn nền
  lcd.noCursor();*/
  // dht11 sensor
  dht.begin();
}



// Cơ chế hoạt động: nếu buzzer kêu vì cảm biến phát hiện nguy hiểm thì việc nhấn nút sẽ không thể tác động đến buzzer, nghĩa là buzzer sẽ chỉ ngừng kêu khi cảm biến thấy không còn nguy hiểm
// Còn nếu buzzer kêu vì nhấn nút thì chỉ tắt được khi nhấn nút thêm 1 lần nữa.
void loop() {
  // put your main code here, to run repeatedly:
  //int state = check_state();
  int state = GREEN;
  /*Serial.print("loop ");
  Serial.println(count_press);
  delay(500);*/
  /*if(count_press % 2 == 0)
  {
    // Nếu trạng thái nguy hiểm thì bật đèn đỏ, tắt các đèn còn lại và cho buzzer kêu tới khi an toàn
    if (state == RED)
    {
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
  }*/

  
  int button_state = digitalRead(BUTTON);
  // Kiểm tra số lần bấm nút, đè nút thì vẫn chỉ tính là 1 lần bấm nút
  // Nếu buzzer đang reo không phải do bấm thì việc bấm nút sẽ không tính là một lần bấm
  if(button_state != lastButtonState)
  {
    if(button_state == HIGH && state == GREEN)
    {
      //isPress = 1;
      count_press ++;
    }
    else if(button_state == LOW && state == GREEN)
    {
      //isPress = 0;
    }
  }
  lastButtonState = button_state;
  on_off_emergency_state();
  //print_to_lcd();
  Serial.println(readTemp());
  //Serial.println(readHumid());
  Serial.println(isGas());
}
