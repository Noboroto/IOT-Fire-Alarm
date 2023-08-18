import React from "react";
// import MyButton from "./components/Button/MyButton";
// import ObjectOther from "./components/ObjectOther/ObjectOther";
import "./style.css";
import BarChart from "./components/BarChart";
import LineChartTemp from "./components/LineChartTemp";
import LineChartHumid from "./components/LineChartHumid";
import LineChartGas from "./components/LineChartGas";
import LineChartAshe from "./components/LineChartAshe";
import { HumidData, TempData, GasData, AsheData } from "./Data";
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useState } from 'react';
const App = () => {
  const [name, setName] = React.useState();
  const [userData, setUserData] = useState({
    labels: TempData.map((data) => data.hour),
    datasets: [{
      label: "Nhiệt độ",
      data: TempData.map((data) => data.rate),
      backgroundColor: 'red',
      borderColor: "black",
      borderWidth: 2,
      font: {
        size: 20
      },
    }]
  })
  const [humidData, setHumidData] = useState({
    labels: HumidData.map((data) => data.hour),
    datasets: [{
      label: "Độ ẩm",
      data: HumidData.map((data) => data.rate),
      backgroundColor: "blue",
      borderColor: "black",
      borderWidth: 2,
      font: {
        size: 20
      },
    }]
  })
  const [gasData, setGasData] = useState({
    labels: GasData.map((data) => data.hour),
    datasets: [{
      label: "Lượng gas",
      data: GasData.map((data) => data.rate),
      backgroundColor: "Grey",
      borderColor: "black",
      borderWidth: 2,
      font: {
        size: 20
      },
    }]
  })
  const [asheData, setAsheData] = useState({
    labels: AsheData.map((data) => data.hour),
    datasets: [{
      label: "Lượng khói",
      data: AsheData.map((data) => data.rate),
      backgroundColor: "yellow",
      borderColor: "black",
      borderWidth: 2,
      font: {
        size: 20
      },
    }]
  })

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
              </div>
            </div>
            <div className="overlap-wrapper">
              <div className="overlap-group-2">
                <div className="rectangle" />
                <div className="rectangle-2" />
              </div>
            </div>
            <div className="text-wrapper">Khí GAS</div>
            <div className="text-wrapper-2">Khói</div>
            <img className="img" alt="Object other" src="object-other-07.png" />
            <div className="gas">0%</div>
            <div className="ashe">0%</div>
          </div>
          <div className="overlap-2">
            <div className="ellipse-2" />
            <div className="rectangle-3" />
            <div className="navbar">
              <ul className="page">
                <li className="link"><a href="" className="home-page">HOME</a></li>
                {/* <li className="link"><a href="/about" className="about-page">About</a></li>
                <li className="link"><a href="/" className="login">Login</a></li>
                <li className="link"><a href="/" className="signup">Sign up</a></li> */}
              </ul>
            </div>

            <div className="overlap-group-wrapper">
              <div className="overlap-group-2">
                <div className="rectangle" />
                <div className="rectangle-2" />
              </div>
            </div>
            <h1 className="h-1">HỆ THỐNG BÁO CHÁY</h1>
            <div className="text-wrapper-9">Nhiệt độ</div>
            <div className="temperature">25°C</div>
          </div>
          <div className="overlap-3">
            <div className="div-wrapper">
              <div className="overlap-group-2">
                <div className="rectangle" />
                <div className="rectangle-2" />
              </div>
            </div>
            <div className="text-wrapper-11">Độ ẩm</div>
            <div className="humidity">50%</div>
          </div>
          <div className="charts">
            <div className="temp-wrapper">
              <div className="chart-temp">
                <div className="chart-temp-ratio">
                  <LineChartTemp chartData={userData} />
                </div>
              </div>
            </div>
            <div className="humid-wrapper">
              <div className="chart-humid">
                <div className="chart-humid-ratio">
                  <LineChartHumid chartData={humidData} />
                </div>
              </div>
            </div>
            <div className="gas-wrapper">
              <div className="chart-gas">
                <div className="chart-gas-ratio">
                  <LineChartGas chartData={gasData} />
                </div>
              </div>
            </div>
            <div className="ashe-wrapper">
              <div className="chart-ashe">
                <div className="chart-ashe-ratio">
                  <LineChartAshe chartData={asheData} />
                </div>
              </div>
            </div>
          </div>
          <div className="group-2">
            <div className="overlap-4">
              <div className="alarmButton">Kích hoạt báo cháy</div>
            </div>
          </div>
        </div>
        <div className="group-4">
          <div className="overlap-5">
            <div className="text-wrapper-14">Hệ thống báo cháy</div>
            <div className="email-linkedin">
              Email
              <br />
              <a href="https://www.linkedin.com/in/1110phuong/" className="link-linkedin" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <br />
              <a href="https://www.facebook.com/cac1110/" className="link-fb" target="_blank" rel="noopener noreferrer">Facebook</a>
              <br />
              <a href="https://github.com/thanhphuong1110" className="link-git" target="_blank" rel="noopener noreferrer">Github</a>
            </div>
            <div className="text-wrapper-16">contact</div>
          </div>
          <Box className ="feedback"sx={{ '& > :not(style)': { m: 1 } }}> <FormControl variant="standard">
        <InputLabel htmlFor="input-with-icon-adornment">
          Write your feedback
        </InputLabel>
        <Input
          id="input-with-icon-adornment"
          startAdornment={
            <InputAdornment position="start">
              <AccountCircle />
            </InputAdornment>
          }
        />
      </FormControl></Box>
        <div className="wrap-submit">
          <div className="submit-button">SEND</div>
        </div>
        </div>
      </div>
    </div>
  )
}
export default App;