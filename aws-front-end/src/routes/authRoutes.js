import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getToken } from '../service/auth';

const AuthRoute = ({ type, redirectTo = '/loggedin' }) => {
    const isAuthenticated = getToken(); 

    if (type === 'private') {
        // PrivateRoute functionality
        // if not auhtenticated redirect user to login page
        return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
    } else {
        // PublicRoute functionality
        // if authenticated disable register and login pages and navigate user to user content page
        return !isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} replace />;
    }
};

export default AuthRoute;
