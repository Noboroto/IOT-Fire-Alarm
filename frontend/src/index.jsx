import React from "react";
import ReactDOM from 'react-dom/client';

import Login from "./pages/Login";
import HomePage from "./pages/HomePage"
import NotPermit from "./pages/NotPermit"
import NotFound from "./pages/NotFound"

import {Routes, Route, BrowserRouter } from 'react-router-dom'


ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/NotPermit" element={<NotPermit />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
)
