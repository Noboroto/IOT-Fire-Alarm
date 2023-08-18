import React from "react";
import ObjectOther from "../../components/ObjectOther/ObjectOther"
// import MyButton from "../../components/Button/MyButton";
import About from "../AboutPage/About";
import {Routes, Route, Link } from "react-router-dom";


import "./style.css";
const Home = () => {
  return (
      <div className="home">
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
              <ObjectOther className="object-other-07" />
              <div className="text-wrapper-3">0%</div>
              <div className="text-wrapper-4">0%</div>
            </div>
            <div className="overlap-2">
              <div className="ellipse-2" />
              <div className="rectangle-3" />
              <div className="navbar">
                <ul className="page">
                  <li className="link"><Link to="/" className="home-page">Home</Link></li>
                  <li className="link"><Link to="/about" className="about-page">About</Link></li>
                  <li className="link"><a href="/" className="login">Login</a></li>
                  <li className="link"><a href="/" className="signup">Sign up</a></li>
                </ul>
              </div>
              <Routes>
                <Route path="/" exact element={<Home />}></Route>
                <Route path="/about" exact element={<About />}></Route>
              </Routes>
              <div className="overlap-group-wrapper">
                <div className="overlap-group-2">
                  <div className="rectangle" />
                  <div className="rectangle-2" />
                </div>
              </div>
              <div className="text-wrapper-9">Nhiệt độ</div>
              <h1 className="h-1">HỆ THỐNG BÁO CHÁY</h1>
              <div className="text-wrapper-10">25°C</div>
            </div>
            <div className="overlap-3">
              <div className="div-wrapper">
                <div className="overlap-group-2">
                  <div className="rectangle" />
                  <div className="rectangle-2" />
                </div>
              </div>
              <div className="text-wrapper-11">Độ ẩm</div>
              <div className="text-wrapper-12">50%</div>
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
              <div className="home-about">
                Home
                <br />
                About
              </div>
              <div className="email-linkedin">
                Email
                <br />
                LinkedIn
                <br />
                Facebook
                <br />
                Hotline
              </div>
              <div className="text-wrapper-15">HTBC</div>
              <div className="text-wrapper-16">contact</div>
            </div>
          </div>
        </div>
      </div>
  )
}
export default Home;