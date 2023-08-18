import React from "react";
import  ObjectOther  from "../../components/ObjectOther/ObjectOther";
import "./style.css"; 
const About = () => {
    return (
        <div className="about">
          <div className="overlap-wrapper">
            <div className="overlap">
              <div className="overlap-group">
                <div className="ellipse" />
                <div className="div" />
                <div className="ellipse-2" />
                <div className="status-bar">
                  <div className="navbar">
                    <div className="text-wrapper">HOME</div>
                    <div className="text-wrapper-2">Login</div>
                    <div className="text-wrapper-3">About us</div>
                    <div className="text-wrapper-4">Sign up</div>
                  </div>
                </div>
                <ObjectOther className="object-other-18" />
                <div className="introducing">
                  <div className="overlap-2">
                    <div className="rectangle" />
                    <div className="text-wrapper-5">Võ Thanh Tú</div>
                    <img
                      className="mask-group"
                      alt="Mask group"
                      src="https://generation-sessions.s3.amazonaws.com/09176f7d56fbbb4c6e65deb521317c1b/img/mask-group-2@2x.png"
                    />
                  </div>
                </div>
                <div className="overlap-group-wrapper">
                  <div className="overlap-3">
                    <div className="rectangle" />
                    <div className="text-wrapper-6">Võ Phạm Thanh Phương</div>
                    <p className="p">
                      A human of HCMUS in Faculty of Information Technology with a dream of a software engineer
                    </p>
                    <img
                      className="img"
                      alt="Mask group"
                      src="https://generation-sessions.s3.amazonaws.com/09176f7d56fbbb4c6e65deb521317c1b/img/mask-group@2x.png"
                    />
                  </div>
                </div>
                <div className="text-wrapper-7">Võ Thanh Tú</div>
                <div className="text-wrapper-8">Võ Phạm Thanh Phương</div>
                <p className="text-wrapper-9">A human of HCMUS in Faculty of Information Technologu</p>
                <div className="info-space">
                  <div className="overlap-4">
                    <div className="text-wrapper-10">Hệ thống báo cháy</div>
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
                    <div className="text-wrapper-11">HTBC</div>
                    <div className="text-wrapper-12">contact</div>
                  </div>
                </div>
              </div>
              <div className="text-wrapper-13">ABOUT US</div>
              <div className="overlap-5">
                <div className="div-wrapper">
                  <div className="overlap-6">
                    <div className="rectangle-2" />
                    <div className="text-wrapper-14">Nguyễn Khánh Nhân</div>
                    <p className="text-wrapper-15">
                      A human of HCMUS in Faculty of Information Technology specializing in Computer Science
                    </p>
                    <img
                      className="mask-group-2"
                      alt="Mask group"
                      src="https://generation-sessions.s3.amazonaws.com/09176f7d56fbbb4c6e65deb521317c1b/img/mask-group-1@2x.png"
                    />
                  </div>
                </div>
                <div className="text-wrapper-16">Nguyễn Khánh Nhân</div>
              </div>
            </div>
          </div>
        </div>
    )
}
export default About;