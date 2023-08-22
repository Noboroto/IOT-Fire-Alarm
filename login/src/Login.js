import React from "react";
import "./styles.css";
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Button } from "@mui/material";
import { useState } from 'react';

const Login = () => {
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
    return (
        <div className="login">
            <div className="overlap-wrapper">
                <div className="overlap">
                    <div className="overlap-group">
                        <div className="ellipse" />
                        <div className="div" />
                        <div className="rectangle" />
                        <div className="home">
                            <a className="text-wrapper" href="">LOGIN</a>
                        </div>
                    </div>
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
                        <div className="login-box" />
                        <div className="signin-option">
                        <a class="button google" href="">Sign in with Google</a>
                        </div>
                    </div>
                    <div className="text-wrapper-4">LOGIN</div>
                </div>
            </div>
        </div>
    );
};
export default Login;