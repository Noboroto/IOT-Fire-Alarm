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

import { login } from "../../Redux/Slice/User";
import store from "../../Redux/store";
import { useNavigate } from "react-router";
import axios from "axios";

const API_URI = "http://localhost:4000"    
const checkPass = async (uname, pass) => {
        try {
            const { data: response } = await axios.get(`${API_URI}/valid`, {
                params:{
                    uname,
                    pass
                }
            });
            return JSON.parse(response)["accept"]
        } catch (error) {
            console.error(error.message);
        }
    }

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
        },
        {
            username: "admin",
            password: "admin"
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
    const navigate = useNavigate()

    const [uname, setUname] = useState("");
    const [pass, setPass] = useState("");

    const onUnameChange = (e) => {
        e.preventDefault();
        setUname(e.target.value);
    }

    const onPassChange = (e) => {
        e.preventDefault();
        setPass(e.target.value);
    }

    // For submit
    const handleSubmit = (event) => {
        // Prevent page reload
        event.preventDefault();

        // Find user login info
        const userData = database.find((user) => user.username === uname);

        checkPass(uname, pass).then((res) => {
            // Compare user info
            if (userData) {
                if (userData.password !== pass) {
                    // Invalid password
                    setErrorMessages({ name: "pass", message: errors.pass });
                } else {
                    setIsSubmitted(true);
                    store.dispatch(login());
                    navigate('/');
                }
            } else {
                // Username not found
                setErrorMessages({ name: "uname", message: errors.uname });
            }
        })
    };
    const sendMail = () => {
        if (message) {
            const emailSubject = 'Sending feedback';
            const recipient = 'vophamthanhphuong@gmail.com';
            const emailBody = `Thông tin nhập từ người dùng : ${message}`;
            const gmailURL = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipient)}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
            window.open(gmailURL, '_blank');
        }
    }

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
                        <div className="container">
                            <div className="screen">
                                <div className="screen__content">
                                    <form className="login-form">
                                        <div className="login__field">
                                            <i className="login__icon fas fa-user"></i>
                                            <input value={uname} onChange={onUnameChange} type="text" className="login__input" placeholder="User name" />
                                        </div>
                                        <div className="login__field">
                                            <i className="login__icon fas fa-lock"></i>
                                            <input value={pass} onChange={onPassChange} type="password" className="login__input" placeholder="Password" />
                                        </div>
                                        <button onClick={handleSubmit} className="button login__submit">
                                            <span className="button__text">Log In Now</span>
                                            <i className="button__icon fas fa-chevron-right"></i>
                                        </button>
                                    </form>
                                </div>
                                <div className="screen__background">
                                    <span className="screen__background__shape screen__background__shape4"></span>
                                    <span className="screen__background__shape screen__background__shape3"></span>
                                    <span className="screen__background__shape screen__background__shape2"></span>
                                    <span className="screen__background__shape screen__background__shape1"></span>
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