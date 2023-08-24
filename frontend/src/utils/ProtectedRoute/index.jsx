import React from 'react'
import { useSelector } from "react-redux"
import Login from '../../pages/Login';

const ProtectedRoute = ({ children }) => {
    const user = useSelector((state) => state.user);

    if (!user.isAuthenticated) {
        return <Login/>
    }
    return children
};

export default ProtectedRoute;