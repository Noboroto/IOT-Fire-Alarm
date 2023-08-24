import React, { useEffect } from "react";
import "./style.css";
import { Button } from "@mui/material";
import LineChartTemp from "../../components/LineChartTemp";
import { TempDemoData } from "../../InitData";
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useState } from 'react';
import axios from 'axios';
import { logout } from "../../Redux/Slice/User";
import store from "../../Redux/store";
import { useNavigate } from "react-router";

const BUTTON_ACTIVE_MESSAGE = "KÍCH HOẠT BÁO CHÁY";
const BUTTON_INACTIVE_MESSAGE = "HỦY BÁO CHÁY";
const API_URI = "http://localhost:4000"
const intervalTime = 10

const Homepage = () => {
  const [message, setMessage] = useState('');
  const [buttonText, setButtonText] = useState(BUTTON_ACTIVE_MESSAGE);
  const [canClick, setCanClick] = useState(true);
  const [backgroundTemplate, setBackgroundTemplate] = useState('overlap-active')

  const navigate = useNavigate()
  const sendMail = () => {
    if (message) {
      const emailSubject = 'Sending feedback';
      const recipient = 'vophamthanhphuong@gmail.com';
      const emailBody = `Thông tin nhập từ người dùng : ${message}`;
      const gmailURL = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipient)}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      window.open(gmailURL, '_blank');
    }
  }

  const handleActiveClick = event => {
    event.preventDefault();
    if (canClick) {
      axios.get(`${API_URI}/press_emergency`, {
        params: {
          emergency: 3
        }
      })
    } else {
      axios.get(`${API_URI}/press_emergency`, {
        params: {
          emergency: 0
        }
      })
    }
  };

  const handleLogoutClick = event => {
    event.preventDefault();
    store.dispatch(logout());
    console.log("logout click!");
    navigate('/');
  };

  const handleChange = event => {
    setMessage(event.target.value);
    console.log('value is: ', event.target.value);
  }

  const [tempChartData, setTempChartData] = useState({
    labels: TempDemoData.map((data) => data["time"]),
    datasets: [{
      label: "Nhiệt độ",
      data: TempDemoData.map((data) => data["rate"]),
      backgroundColor: 'red',
      borderColor: "black",
      borderWidth: 2,
      font: {
        size: 20
      },
    }]
  })

  const [tempData, setTempData] = useState([])
  const [currentTemp, setCurrentTemp] = useState(0)
  const [currentGas, setCurrentGas] = useState("Bình thường")
  const [currentFlame, setCurrentFlame] = useState("Bình thường")

  const fetchTempData = async () => {
    try {
      const { data: response } = await axios.get(`${API_URI}/temperature`);
      return response
    } catch (error) {
      console.error(error.message);
    }
  }

  const fetchGasData = async () => {
    try {
      const { data: response } = await axios.get(`${API_URI}/gas`);
      return response
    } catch (error) {
      console.error(error.message);
    }
  }

  const fetchFlameData = async () => {
    try {
      const { data: response } = await axios.get(`${API_URI}/flame`);
      return response
    } catch (error) {
      console.error(error.message);
    }
  }

  const fetchEmergencyData = async () => {
    try {
      const { data: response } = await axios.get(`${API_URI}/emergency`);
      return response
    } catch (error) {
      console.error(error.message);
    }
  }

  useEffect(() => {
    fetchTempData().then((res) => setTempData(JSON.parse(res)))
    var fetchInterval = setInterval(() => {
      fetchTempData().then((res) => setTempData(JSON.parse(res)))
    }, intervalTime);
    return () => clearInterval(fetchInterval)
  }, [])

  useEffect(() => {
    fetchEmergencyData().then((res) => {
      if (res === 0) {
        setButtonText(BUTTON_ACTIVE_MESSAGE);
        setCanClick(true);
        setBackgroundTemplate('overlap-active')
      } else {
        setButtonText(BUTTON_INACTIVE_MESSAGE);
        setCanClick(false);
        setBackgroundTemplate('overlap-inactive')
      }
    })
    var fetchInterval = setInterval(() => {
      fetchEmergencyData().then((res) => {
        if (res === 0) {
          setButtonText(BUTTON_ACTIVE_MESSAGE);
          setCanClick(true);
          setBackgroundTemplate('overlap-active')
        } else {
          setButtonText(BUTTON_INACTIVE_MESSAGE);
          setCanClick(false);
          setBackgroundTemplate('overlap-inactive')
        }
      })
    }, intervalTime);
    return () => clearInterval(fetchInterval)
  }, [])

  useEffect(() => {
    fetchGasData().then((res) => {
      (res > 0) ? setCurrentGas("Có gas") : setCurrentGas("Bình thường");
    })
    var fetchInterval = setInterval(() => {
      fetchGasData().then((res) => {
        (res > 0) ? setCurrentGas("Có gas") : setCurrentGas("Bình thường");
      })
    }, intervalTime);
    return () => clearInterval(fetchInterval)
  }, [])

  useEffect(() => {
    fetchFlameData().then((res) => {
      (res > 0) ? setCurrentFlame("Có Lửa") : setCurrentFlame("Bình thường");
    })
    var fetchInterval = setInterval(() => {
      fetchFlameData().then((res) => {
        (res > 0) ? setCurrentFlame("Có Lửa") : setCurrentFlame("Bình thường");
      })
    }, intervalTime);
    return () => clearInterval(fetchInterval)
  }, [])

  useEffect(() => {
    if (!tempData) return;
    if (tempData && tempData[tempData.length - 1])
      setCurrentTemp(tempData[tempData.length - 1].rate)
    setTempChartData({
      labels: tempData.map((data) => data["time"]),
      datasets: [{
        label: "Nhiệt độ",
        data: tempData.map((data) => data["rate"]),
        backgroundColor: 'red',
        borderColor: "black",
        borderWidth: 2,
        font: {
          size: 20
        },
      }]
    })
  }, [tempData])

  return (
    <div className="app">
      <div className="div">
        <div className="overlap">
          <div className="logout-box">
            <div className="wrap-logout">
              <Button onClick={handleLogoutClick} className="logout-button">Log out</Button>
            </div>
          </div>
          <div className="overlap-group">
            <div className="ellipse" />
            <div className="group">
              <div className="overlap-group-2">
                <div className="rectangle" />
                <div className="rectangle-2" />
                <div className="text-wrapper">Khí GAS</div>
                <div className="gas">{currentGas}</div>
              </div>
            </div>
            <img className="img" alt="Object other" src="object-other-07.png" />

          </div>
          <div className="overlap-2">
            <div className="ellipse-2" />

            <div className="overlap-temp-wrapper">
              <div className="overlap-group-2">
                <div className="rectangle" />
                <div className="rectangle-2" />
                <div className="text-wrapper-9">Nhiệt độ</div>
                <div className="temperature">{currentTemp}°C</div>
              </div>
            </div>
            <div className="overlap-fire-wrapper">
              <div className="overlap-fire">
                <div className="rectangle-fire" />
                <div className="rectangle-fire-2" />
                <div className="fireLabel">Lửa</div>
                <div className="fire">{currentFlame}</div>
              </div>
            </div>
            <h1 className="h-1">HỆ THỐNG BÁO CHÁY</h1>
          </div>
          <div className="charts">
            <div className="temp-wrapper">
              <div className="chart-temp">
                <div className="chart-temp-ratio">
                  <LineChartTemp chartData={tempChartData} />
                </div>
              </div>
            </div>
          </div>
          <div className="group-2">
            <div className={backgroundTemplate}>
              <Button onClick={handleActiveClick} className="alarmButton">{buttonText}</Button>
            </div>
          </div>
        </div>
        <div className="group-4">
          <div className="overlap-5">
            <div className="text-wrapper-14">Hệ thống báo cháy</div>
            <div className="email-linkedin">
              <a href="https://www.linkedin.com/in/1110phuong/" className="link-linkedin" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <br />
              <a href="https://www.facebook.com/cac1110/" className="link-fb" target="_blank" rel="noopener noreferrer">Facebook</a>
              <br />
              <a href="https://github.com/thanhphuong1110" className="link-git" target="_blank" rel="noopener noreferrer">Github</a>
            </div>
            <div className="text-wrapper-16">contact</div>
          </div>
          <Box className="feedback" sx={{ '& > :not(style)': { m: 1 } }}> <FormControl variant="standard">
            <InputLabel htmlFor="input-with-icon-adornment">
              Write your feedback
            </InputLabel>
            <Input
              id="input-with-icon-adornment"
              type="text"
              name="message"
              onChange={handleChange}
              value={message}
              startAdornment={
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              }
            />
          </FormControl></Box>
          <div className="wrap-submit">
            <Button variant="contained" onClick={sendMail}>Send</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Homepage;
