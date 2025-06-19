import './css/home.css';
import React, { useState } from 'react';
import diagram from './diagram.jpg'; 
import Modal from './components/Modal';

const Home = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    return(
        <div className="home-container">
            <h2>Welcome to the Homepage!</h2>
            <img src='logoPurple.png' alt="website logo" />
            {/* <iframe src="https://trello.com/invite/b/M3utuU4t/ATTI98e8589b0a732b53a7747e0950881a225407DED1/life-2024" width="100%" height="600" frameborder="0" allowtransparency="true" scrolling="auto"></iframe> */}

            {/* show web app architecture */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="home-button"
            >
                View Architecture Diagram
            </button>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2>System Architecture</h2>
                <img src={diagram} alt="System Diagram" style={{ width: '100%', height: 'auto', borderRadius: '10px' }} />
                <p className="modal-description">
                This system shows how the client connects to AWS Coud Services.
                Using React for the front end. Communitcating with an API gateway to Lambda functions,
                which help to create users and handle their authentication. 
                Once authenticated each user is able to add/delete music, manipulating DynamoDB and their respective data. 
                </p>
            </Modal>
        </div>
    )
}

export default Home;
