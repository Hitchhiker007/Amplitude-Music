import React from 'react';

import './popup.css'; 

// isOpen -> should popup be visible?
// content -> object with data
// onClose -> call this when function needs to close
const Popup = ({ isOpen, content, onClose }) => {
    // prevent popup from rednering by default
    if (!isOpen) return null;
    return (
        // div for the popup
        // simple button handler for closing the popup 
        // found this method was easier to display subscription successful rather than updating the loggedin file
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-content" onClick={event => event.stopPropagation()}>
                <div className="popup-body">
                    <img src={content.img_url} alt={content.artist} style={{ width: '250px', height: '250px' }} />
                    <h3>{content.title}</h3>
                    <p>by {content.artist}</p>
                    <p>Subscription successful!</p>
                </div>
                <button className="close-button" onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default Popup;