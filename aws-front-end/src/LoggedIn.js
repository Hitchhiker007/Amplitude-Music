import React, { useState, useEffect } from 'react';
import { getAccount, resetSession } from './service/auth';
import { useNavigate } from "react-router-dom";
import axios from 'axios';  
import './css/LoggedIn.css'; 
import Popup from './service/popup'; 

const LoggedIn = () => {
    // hooks for user data, subscription data, the query handling, and alert ui messaging
    const [username, setUsername] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [subscriptions, setSubscriptions] = useState([]);
    const [queryResult, setQueryResult] = useState([]);
    const [query, setQuery] = useState({ title: '', artist: '', year: '' });
    const [alert, setAlert] = useState(null);
    const [popupOpen, setPopupOpen] = useState(false);
    const [popupContent, setPopupContent] = useState({});
    const navigate = useNavigate();

    // define api endpoints
    const deleteUrl = 'https://hoyntrc0ad.execute-api.ap-southeast-2.amazonaws.com/prod/deleteSubscription';
    const queryUrl = 'https://hoyntrc0ad.execute-api.ap-southeast-2.amazonaws.com/prod/query';
    const subscribeUrl = 'https://hoyntrc0ad.execute-api.ap-southeast-2.amazonaws.com/prod/subscribe';

    // set api key
    const x_api_key = 'uerHTirwmV5Q5Og6LAoOD9airqPY7s2L1mnHYNb1';

    const s3Url = 'https://s3-music-images-hitchhiker.s3.amazonaws.com/';

    // function to construct full S3 image URL from img_url
    const constructS3ImageUrl = (imgUrl) => {
        const fileName = imgUrl.split('/').pop();
        return `${s3Url}${encodeURIComponent(fileName)}`; 
    };

    useEffect(() => {
        // first store the users details in state
        // fetch all previous subscriptions 
        const user = getAccount();
        if (user && user.username && user.email) {
            setUsername(user.username);
            setUserEmail(user.email); 
            fetchSubscriptions(user.email);
        } else {
            navigate("/login");
        }
    }, [navigate]);

    // for current user get all of their subscriptions
    const fetchSubscriptions = async (email) => {
        try{
            const response = await axios.get(`https://hoyntrc0ad.execute-api.ap-southeast-2.amazonaws.com/prod/getSubscription?email=${encodeURIComponent(email)}`,{
            headers: {
                'x-api-key': x_api_key, 
            }
        });
        if (response.data.length === 0) {
            setAlert('You currently have no subscriptions!');
        } else {
            // update the subscriptions and clear any existing alert
            // set all of the sibscription data in this array for further maniuplation within the rendering divs
            setSubscriptions(response.data);
            setAlert(null);
        }
        setSubscriptions(response.data);
        } catch (error) {
            console.error('Error cannot fetch users subscriptions:', error);
        }
    };

    // function for removing any specific subscription when clicking remove button
    const removeSubscription = async (subscriptionId) => {
        try {
            const response = await axios.delete(deleteUrl, {
                headers: {
                    'x-api-key': x_api_key, 
                },
                data: {
                    userEmail: userEmail,
                    subscriptionId: subscriptionId
                }
            });
            if (response.status === 200) {
                // refresh the subscription ui after deleting
                fetchSubscriptions(userEmail); 
            }
        } catch (error) {
            console.error('Error removing subscription:', error);
        }
    };
    
    // post axios request using whats in the query table for searching the subscription table
    const handleQuery = async () => {
        try {
            const response = await axios.post(queryUrl,query,{
                    headers: {
                        'x-api-key': x_api_key, 
                    }
                }
            );
            const data = response.data;
            if (data.length === 0) {
                setQueryResult(['No result is retrieved. Please query again']);
            } else {
                setQueryResult(data);
                console.log('Query success!', data); 
            }
        } catch (error) {
            console.error('Error querying music:', error);
            setQueryResult(['No result is retrieved. Please query again.']);
        }
    };
    
    // sends the currently clicked items data to a request body and is updated into the subscription table
    // also invokes the popup function
    const handleSubscribe = async (item) => {
        try {
          const requestBody = {
            userEmail: userEmail, 
            img_url: item.img_url,
            artist: item.artist,
            title: item.title
          };
        //   console.log('Request Body:', requestBody);
          const response = await axios.post(subscribeUrl, requestBody, {
            headers: {
              'x-api-key': x_api_key,
            }
          });
        // set popup content with data received from response
          setPopupContent({
            img_url: item.img_url,
            title: item.title,
            artist: item.artist
          });
          // open popup when user subscribes
          setPopupOpen(true); 
          // if the request is successful, update the UI accordingly
          if (response.status === 200) {
            console.log('Subscription successful:', response.data);
            // You can also update state to reflect the new subscription
          }
        } catch (error) {
          console.error(error);
        }
        // call this to update the ui for each indivdual addition
        fetchSubscriptions(userEmail);
      };
      
    // on logout redirect to login page and reset user and token
    const logoutHandler = () => {
        resetSession();
        navigate("/login");
    };

    return (
        <div className="loggedin-container">
            <div className="user-area">
                {/* display current user here ---------------------------------------------------------------------------------*/}
                <h2>User Area</h2>
                <p>Welcome Back {username}! You Have Logged In</p>
                <button className="button" onClick={logoutHandler}>Logout</button>
            </div>
            <div className="subscription-area">
                {/* users current subscriptions with removal option ----------------------------------------------------------- */}
                <h2>Subscription Area</h2>
                {alert && <p className="alert">{alert}</p>}
                {subscriptions.map((sub) => (
                    // create a new array for each subscriptions
                    // subscription id is used to identify each element
                    // when clicking remove on the current ui element, the id of that element is passed to removeSubscription()
                    <div key={sub.subscriptionId}>
                        <p>{sub.title} by {sub.artist}</p>
                        <img 
                                src={constructS3ImageUrl(sub.img_url)} 
                                alt={""} 
                                style={{ width: '100px', height: '100px' }} 
                            />

                        <button className="button" onClick={() => removeSubscription(sub.subscriptionId)}>Remove</button>
                    </div>
                ))}
            </div>
            <div className="query-area">
            <div>
                {/* query section --------------------------------------------------------------------------------------------- */}
                <h2>Query Area</h2>
                <input className="query-input" type="text" placeholder="Title" value={query.title} onChange={(event) => setQuery({ ...query, title: event.target.value })} />
                <input className="query-input" type="text" placeholder="Artist" value={query.artist} onChange={(event) => setQuery({ ...query, artist: event.target.value })} />
                <input className="query-input" type="text" placeholder="Year" value={query.year} onChange={(event) => setQuery({ ...query, year: event.target.value })} />
                <button className="button" onClick={handleQuery}>Query</button>
                <div>
                    {/* here .map() iterates over each element in queryResult array which is the product of handleQuery() */}
                    {queryResult.map((item, index) => typeof item === 'string' ? (
                        <p key={index}>{item}</p>
                    ) : (
                        <div key={item.id}>
                            <p>{item.title} by {item.artist} ({item.year})</p>
                            <img src={item.img_url} alt={item.artist} style={{ width: '100px', height: '100px' }} />
                            {/* here item is passed to handleSubscribe which sends the subscribe request to the api */}
                            <button className="button" onClick={() => handleSubscribe(item)}>Subscribe</button>
                            <Popup isOpen={popupOpen} content={popupContent} onClose={() => setPopupOpen(false)} />
                        </div>
                    ))}
                </div>
            </div>
                
            </div>
        </div>
    );
};

export default LoggedIn;

