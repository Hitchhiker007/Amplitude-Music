import './css/home.css';
import React, { useState } from 'react';
import diagram from './diagram.jpg';
import Modal from './components/Modal';

const Home = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="home-root">
            <div className="home-scanlines" />
            <div className="home-grid" />

            <div className="home-content">

                {/* HEADER BAR */}
                <div className="home-topbar">
                    <span>AMPLITUDE // v1.0.0</span>
                    <span className="home-live">● ONLINE</span>
                </div>

                {/* HERO */}
                <div className="home-hero">
                    <div className="home-hero-label">// MUSIC INTELLIGENCE SYSTEM</div>
                    <h1 className="home-title">AMPLITUDE</h1>
                    <p className="home-subtitle">
                        YOUR LISTENING DATA. VISUALISED. DECODED. AMPLIFIED.
                    </p>
                    <div className="home-divider" />
                    <p className="home-description">
                        Connect your Last.fm account and explore your music history.
                        Real-time scrobble data, top artists, recent tracks — all rendered in one place.
                    </p>

                    <div className="home-btn-row">
                        <a href="/register" className="home-btn home-btn-primary">
                            ▶ GET STARTED
                        </a>
                        <a href="/login" className="home-btn home-btn-secondary">
                            → LOGIN
                        </a>
                        <button
                            className="home-btn home-btn-ghost"
                            onClick={() => setIsModalOpen(true)}
                        >
                            ⬡ ARCHITECTURE
                        </button>
                    </div>
                </div>

                {/* FEATURE GRID */}
                <div className="home-features">
                    <div className="home-feature-card">
                        <div className="home-feature-icon">◈</div>
                        <div className="home-feature-title">SCROBBLE DATA</div>
                        <div className="home-feature-desc">
                            Pull your complete listening history directly from Last.fm in real time.
                        </div>
                    </div>
                    <div className="home-feature-card">
                        <div className="home-feature-icon">▲</div>
                        <div className="home-feature-title">TOP ARTISTS</div>
                        <div className="home-feature-desc">
                            Discover your most played artists with playcounts and artwork.
                        </div>
                    </div>
                    <div className="home-feature-card">
                        <div className="home-feature-icon">◉</div>
                        <div className="home-feature-title">TOP ALBUMS</div>
                        <div className="home-feature-desc">
                            Browse your most revisited records with full album art and stats.
                        </div>
                    </div>
                    <div className="home-feature-card">
                        <div className="home-feature-icon">⟳</div>
                        <div className="home-feature-title">RECENT TRACKS</div>
                        <div className="home-feature-desc">
                            See exactly what you've been listening to — track by track.
                        </div>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="home-footer">
                    <span>AMPLITUDE // BUILT ON AWS + LAST.FM</span>
                    <span className="home-sys-ok">SYS.OK</span>
                </div>
            </div>

            {/* MODAL */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="home-modal-inner">
                    <div className="home-modal-label">// SYSTEM ARCHITECTURE</div>
                    <img src={diagram} alt="System Diagram" className="home-modal-img" />
                    <p className="home-modal-desc">
                        React frontend communicates with AWS API Gateway, routing requests to Lambda functions
                        which handle user authentication and data management via DynamoDB.
                        Last.fm API provides real-time scrobble and music data.
                    </p>
                </div>
            </Modal>
        </div>
    );
};

export default Home;