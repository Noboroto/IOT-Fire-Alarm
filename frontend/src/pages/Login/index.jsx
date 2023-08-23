import React from "react";
import "./styles.css";
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';

import AccountCircle from '@mui/icons-material/AccountCircle';
import { Button } from "@mui/material";
import { useState } from 'react';

const Login = () => {
    // For error message
    const [errorMessages, setErrorMessages] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const database = [
        {
            username: "user1",
            password: "pass1"
        },
        {
            username: "user2",
            password: "pass2"
        }
    ];

    const errors = {
        uname: "invalid username",
        pass: "invalid password"
    };
    const renderErrorMessage = (name) =>
        name === errorMessages.name && (
            <div className="error">{errorMessages.message}</div>
        );
    const [message, setMessage] = useState('');

    // For submit
    const handleSubmit = (event) => {
        // Prevent page reload
        event.preventDefault();

        var { uname, pass } = document.forms[0];

        // Find user login info
        const userData = database.find((user) => user.username === uname.value);

        // Compare user info
        if (userData) {
            if (userData.password !== pass.value) {
                // Invalid password
                setErrorMessages({ name: "pass", message: errors.pass });
            } else {
                setIsSubmitted(true);
            }
        } else {
            // Username not found
            setErrorMessages({ name: "uname", message: errors.uname });
        }
    };
    const renderForm = (
        <div className="form">
            <form onSubmit={handleSubmit}>
                <div className="input-container username-container">
                    <label className="text-label">Username </label>
                    <input type="text" name="uname" required />
                    {renderErrorMessage("uname")}
                </div>
                <div className="input-container password-container">
                    <label className="text-label">Password </label>
                    <input type="password" name="pass" required />
                    {renderErrorMessage("pass")}
                </div>
                <div className="button-container">
                    <input type="submit" />
                </div>
            </form>
        </div>
    );

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
    return (
        <div className="login">
            <div className="overlap-wrapper">
                <div className="overlap">
                    <div className="overlap-2">
                        <div className="ellipse-2" />
                        <div className="ellipse-3" />
                        <div className="detail-wrapper">
                            <div className="overlap-group-2">
                                <div className="text-wrapper-2">Hệ thống báo cháy</div>
                                <div className="email-linkedin">
                                    <a href="https://www.linkedin.com/in/1110phuong/" className="link-linkedin" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                                    <br />
                                    <a href="https://www.facebook.com/cac1110/" className="link-fb" target="_blank" rel="noopener noreferrer">Facebook</a>
                                    <br />
                                    <a href="https://github.com/thanhphuong1110" className="link-git" target="_blank" rel="noopener noreferrer">Github</a>
                                </div>
                                <div className="text-wrapper-3">contact</div>
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
                        <img className="img-login" alt="Object other" src="object-other-12.png" />
                        {/* <div className="login-box" /> */}
                        <div class="container">
                            <div class="screen">
                                <div class="screen__content">
                                    <form class="login-form">
                                        <div class="login__field">
                                            <i class="login__icon fas fa-user"></i>
                                            <input type="text" class="login__input" placeholder="User name / Email"/>
                                        </div>
                                        <div class="login__field">
                                            <i class="login__icon fas fa-lock"></i>
                                            <input type="password" class="login__input" placeholder="Password"/>
                                        </div>
                                        <button class="button login__submit">
                                            <span class="button__text">Log In Now</span>
                                            <i class="button__icon fas fa-chevron-right"></i>
                                        </button>
                                    </form>
                                </div>
                                <div class="screen__background">
                                    <span class="screen__background__shape screen__background__shape4"></span>
                                    <span class="screen__background__shape screen__background__shape3"></span>
                                    <span class="screen__background__shape screen__background__shape2"></span>
                                    <span class="screen__background__shape screen__background__shape1"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="text-wrapper-4">LOGIN</div>
                </div>
            </div>
        </div>
    );
};
export default Login;