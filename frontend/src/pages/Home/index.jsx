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

const API_URI = "http://localhost:4000"
const intervalTime = 1000

const Homepage = () => {
  const [message, setMessage] = useState('');
  const sendMail = () => {
    if (message) {
      const emailSubject = 'Sending feedback';
      const recipient = 'vophamthanhphuong@gmail.com';
      const emailBody = `Thông tin nhập từ người dùng : ${message}`;
      const gmailURL = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipient)}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      window.open(gmailURL, '_blank');
    }
  }

  const handleClick = event => {
    event.preventDefault();
    console.log('handleClick 👉️', message);
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

  const fetchData = async () => {
    try {
      const { data: response } = await axios.get(`${API_URI}/temperature`);
      return response
    } catch (error) {
      console.error(error.message);
    }
  }

  useEffect(() => {
    var fetchInterval = setInterval(() => {
      fetchData().then((res) => setTempData(JSON.parse(res)))
    }, intervalTime);
    return () => clearInterval(fetchInterval)
  }, [])

  useEffect(() => {
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
  },[tempData])
  const gasStatus = ["Bình thường", "Có nguy cơ"]
  const fireStatus = ["Bình thường", "Có nguy cơ"]
  return (
    <div className="app">
      <div className="div">
        <div className="overlap">
          <div className="overlap-group">
            <div className="ellipse" />
            <div className="group">
              <div className="overlap-group-2">
                <div className="rectangle" />
                <div className="rectangle-2" />
                <div className="text-wrapper">Khí GAS</div>
                <div className="gas">{gasStatus[1]}</div>
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
                <div className="temperature">25°C</div>
              </div>
            </div>
            <div className="overlap-fire-wrapper">
              <div className="overlap-fire">
                <div className="rectangle-fire" />
                <div className="rectangle-fire-2" />
                <div className="fireLabel">Lửa</div>
                <div className="fire">{fireStatus[0]}</div>
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
            <div className="overlap-4">
              <Button className="alarmButton">KÍCH HOẠT BÁO CHÁY</Button>
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
