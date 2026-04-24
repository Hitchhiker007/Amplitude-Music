import React , {useState} from 'react';
import axios from 'axios';
import './css/Register.css';

// defining the aws api gateway invoke url and api key
// api key visible in code = bad
const registerUrl = 'https://hoyntrc0ad.execute-api.ap-southeast-2.amazonaws.com/prod/register';
const x_api_key = 'uerHTirwmV5Q5Og6LAoOD9airqPY7s2L1mnHYNb1';

const Register = () => {

     // state hooks for setting registration information and ui alert messages
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [alert, setAlert] = useState(null);
    const [successAlert, setSuccessAlert] = useState('');

    // submit form handler
    const submitHandler = (event) =>{
        event.preventDefault();
        // check for any empty fields, all are required
        if (username.trim() === '' || email.trim() === '' || password.trim() === '') {
            setAlert('All fields are required!');
            setTimeout(() => setAlert(''), 5000);
            return;
        }

        // axios request
        const requestConfig = {
            headers: {
                'x-api-key': x_api_key
            }
        }
        // request body has to match login table!
        const requestBody = {
            user_name: username,
            email: email,
            password: password
        }
        // POST request to the register API endpoint to connect to lamdba function
        axios.post(registerUrl, requestBody, requestConfig).then(response => {
            setSuccessAlert('Your Registration Has Been Successful!')
            setTimeout(() => setSuccessAlert(''), 5000);
        }).catch(error => {
            // multiple reponse scenarios
            // etc. server is unable to provide response that matches the client's requested format
            // aka server is unable to register since user already exists in this case
            if (error.response) {
                if (error.response.status === 401 || error.response.status === 403) {
                    setAlert('Sorry Server Issue!');
                    setAlert(error.response.data.alert);
                } else if (error.response.status === 406) {
                    setAlert('Sorry User Already Exists!');
                    setTimeout(() => setAlert(''), 5000);
                } else {
                    setAlert('Sorry Server Issue!');
                }
            } else {
                // if all else fails show this error, should never trigger
                setAlert('An unexpected error occurred');
            }
        });
};
    // render registration form
    // on submit execute all of the above 
    return(
        <div className="register-root">
            <div className="register-scanlines" />
            <div className="register-grid" />
            <div className="register-box">
                <div className="register-header-label">// CREATE ACCOUNT</div>
                <h1 className="register-title">AMPLITUDE</h1>
                <p className="register-subtitle">REGISTER TO GET STARTED</p>
                <div className="register-divider" />
                <form onSubmit={submitHandler} className="register-form">
                    <div className="register-field">
                        <label className="register-label">EMAIL_</label>
                        <input className="register-input" type="text" value={email} onChange={event => setEmail(event.target.value)} placeholder="user@example.com" />
                    </div>
                    <div className="register-field">
                        <label className="register-label">USERNAME_</label>
                        <input className="register-input" type="text" value={username} onChange={event => setUsername(event.target.value)} placeholder="your_username" />
                    </div>
                    <div className="register-field">
                        <label className="register-label">PASSWORD_</label>
                        <input className="register-input" type="password" value={password} onChange={event => setPassword(event.target.value)} placeholder="••••••••" />
                    </div>
                    <button type="submit" className="register-btn">▶ REGISTER</button>
                </form>
                {/* this is used for state hook displaying to user error messages within the ui */}
                {/* green message for success */}
                {alert && <div className="register-alert">⚠ {alert}</div>}
                {successAlert && <div className="register-success">✓ {successAlert}</div>}
                <div className="register-footer">
                    HAVE AN ACCOUNT? <a href="/login" className="register-link">LOGIN HERE →</a>
                </div>
            </div>
        </div>
    )
}

export default Register;