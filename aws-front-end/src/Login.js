import React, { useState } from 'react';
import './css/Login.css';
import { setSession } from './service/auth';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

// defining the aws api gateway invoke url and api key
const loginUrl = 'https://hoyntrc0ad.execute-api.ap-southeast-2.amazonaws.com/prod/login';
const x_api_key = 'uerHTirwmV5Q5Og6LAoOD9airqPY7s2L1mnHYNb1';

const Login = (props) => {

    // state hooks for email, password and ui alert messages
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [alert, setAlert] = useState(null);

    // create hook for success login navigation
    const navigate = useNavigate();

    const submitHandler = (event) => {
        event.preventDefault();
        // check if email and password are empty
        if (email.trim() === '' || password.trim() === '') {
            setAlert('Email and Password required!');
            setTimeout(() => setAlert(''), 5000);
            return;
        }
        // clear alerts
        setAlert(null);

        // axios request config
        const requestConfig = {
            headers: {
                'x-api-key': x_api_key
            }
        }
        // body MUST have email and password for lambda function
        const requestBody = {
            email: email,
            password: password
        }
        // axios POST request to api endpoint
        axios.post(loginUrl, requestBody, requestConfig).then(response => {
            // when login succesful set the current session with the user and token
            setSession(response.data.user, response.data.token);
            // now automatically naviagte to the main page
            navigate("/loggedin");
            console.log("Login Successful!");
        }).catch(error => {
            // catch any errors
            console.log("Error couldnt make request:", error);
            if (error.response) {
                console.error("Response error :", error.response.status);
                setAlert(error.response.data.message);
                setTimeout(() => setAlert(''), 5000);
            } else if (error.request) {
                console.error("No response ", error.request);
                setAlert('Unable to connect server. Please check your network connection.');
                setTimeout(() => setAlert(''), 5000);
            } else {
                console.error("Error couldnt make request:", error.message);
            }
        })
    }

    // render login form
    // on submit execute all of the above 
    return (
        <div>
            <form onSubmit={submitHandler}>
                <h5>Login</h5>
                email: <input type="text" value={email} onChange={event => setEmail(event.target.value)} />
                password: <input type="password" value={password} onChange={event => setPassword(event.target.value)} />
                <input type="submit" value="Login" />
            </form>
            {/* this is used for state hook displaying to user error messages within the ui */}
            {alert && <p className="alert">{alert}</p>}
        </div>
    )
}

export default Login;
