import React from "react";
import ReactDOM from 'react-dom/client';

import Login from "./pages/Login";
import Homepage from "./pages/Home"
import NotFound from "./pages/NotFound"
import store from './Redux/store'
import { Provider } from 'react-redux';
import ProtectedRoute from "./utils/ProtectedRoute";


import { Routes, Route, BrowserRouter } from 'react-router-dom'


ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={
                        <ProtectedRoute>
                            <Homepage />
                        </ProtectedRoute>}/>
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
)
