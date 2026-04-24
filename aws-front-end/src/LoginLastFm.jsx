import React, { useState } from 'react';
import './css/Login.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { getAccount } from './service/auth';

// defining the aws api gateway invoke url and api key
const lastFmLoginUrl = 'https://hoyntrc0ad.execute-api.ap-southeast-2.amazonaws.com/prod/loginLastFm';
const x_api_key = 'uerHTirwmV5Q5Og6LAoOD9airqPY7s2L1mnHYNb1';

const LastFmLogin = (props) => {

    // state hooks for email, password and ui alert messages
    const [lastFmUsername, setLastFmUsername] = useState('');
    const [alert, setAlert] = useState(null);

    // create hook for success login navigation
    const navigate = useNavigate();

    const user = getAccount();
    const email = user.email;

    const submitHandler = (event) => {
        event.preventDefault();
        // check if email and password are empty
        if (lastFmUsername.trim() === '') {
            setAlert('Last.fm username is required!');
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
            lastFmUsername: lastFmUsername
        }
        // axios POST request to api endpoint
        axios.put(lastFmLoginUrl, requestBody, requestConfig).then(response => {
            // now automatically naviagte to the main page
            navigate("/lastFmDashboard");
            console.log("Last Fm Successfuly Connected!");
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
            <div className="login-header-label">// CONNECT LAST.FM</div>
            <form onSubmit={submitHandler} className="login-form">
                <div className="login-field">
                    <label className="login-label">LAST.FM USERNAME_</label>
                    <input
                        className="login-input"
                        type="text"
                        value={lastFmUsername}
                        onChange={event => setLastFmUsername(event.target.value)}
                        placeholder="your_lastfm_username"
                    />
                </div>
                <button type="submit" className="login-btn">▶ CONNECT</button>
            </form>
            {/* this is used for state hook displaying to user error messages within the ui */}
            {alert && <div className="login-alert">⚠ {alert}</div>}
        </div>
    )
}

export default LastFmLogin;