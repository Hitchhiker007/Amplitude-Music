import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAccount } from './service/auth';
import './css/LastFmDashboard.css';
import { getUserInfo, getRecentTracks, getTopArtists, getTopAlbums } from './service/lastFmService';

const LastFmDashboard = () => {
    const navigate = useNavigate();

    // get the current logged in user from session storage
    const user = getAccount();

    // last fm api key for authenticating requests to the last fm api
    const lastFmApiKey = process.env.REACT_APP_LASTFM_API_KEY;

    // extract the last fm username from the user object stored in session
    // this was saved to dynamodb when the user connected their last fm account
    const lastFmUsername = user.lastFmUsername;

    // state hooks for storing all last fm data once fetched
    const [topArtists, setTopArtists] = useState([]);
    const [topAlbums, setTopAlbums] = useState([]);
    const [userInfo, setUserInfo] = useState([]);
    const [recentTracks, setRecentTracks] = useState([]);

    // loading state controls whether we show the loading screen or the dashboard
    const [loading, setLoading] = useState(true);


    // on component mount, fetch all last fm data in a single async function
    // all four requests run sequentially — if any fail the catch block fires
    useEffect(() => {
    const fetchUserData = async () => {
        try {
            const [userInfo, recentTracks, topAlbums, topArtists] = await Promise.all([
                getUserInfo(lastFmUsername), 
                getRecentTracks(lastFmUsername), 
                getTopAlbums(lastFmUsername),
                getTopArtists(lastFmUsername)
            ]);

            // log raw responses for debugging — can be removed in production
            console.log('userInfo:', userInfo.data);
            console.log('recentTracks:', recentTracks.data);
            console.log('topArtists:', topArtists.data);
            console.log('topAlbums:', topAlbums.data);
    
            // last fm returns an error field in the response body (not an http error)
            // so we check for it manually on each response
            if (userInfo.data.error) {
                return console.error(403, { message: 'Cannot get user data!' });
             }
            if (recentTracks.data.error) { 
                return console.error(403, { message: 'Cannot get user recent tracks data!' });
            }
            if (topArtists.data.error) { 
                return console.error(403, { message: 'Cannot get user top artist data!' }); 
            }
            if (topAlbums.data.error) { 
                return console.error(403, { message: 'Cannot get user top albums data!' });
            }

            // extract the relevant arrays from each response and store in state
            // each last fm response wraps data in a named object
            setUserInfo(userInfo.data.user);
            setRecentTracks(recentTracks.data.recenttracks.track);
            setTopAlbums(topAlbums.data.topalbums.album);
            setTopArtists(topArtists.data.topartists.artist);

            // all data loaded successfully hide the loading screen
            setLoading(false);

        } catch (error) {
            // catches network errors or unexpected response shapes
            console.error('Error connecting Last.fm account:', error);
            return console.error(503, { message: 'Could not connect to Last.fm, please try again!' });
        }
    }
    fetchUserData();
}, []);

    // helper function to extract an image url from last fms image array
    const getImage = (images, size = 'large') => {
        if (!images) return null;
        const img = images.find(i => i.size === size);
        return img && img['#text'] ? img['#text'] : null;
    };

    // last fm removed artist images from their api due to licensing issues
    // as a workaround, we just use the artists top album from our already-fetched
    // topAlbums data 
    const getArtistAlbumArt = (artistName) => {
        const album = topAlbums.find(a => a.artist.name === artistName);
        return album ? getImage(album.image, 'large') : null;
    };
 
    // converts a unix timestamp "he seconds to epoch" to a readable date string
    // last fm stores track dates as unix timestamps
    // if no timestamp exists the track is currently playing
    const formatDate = (unixTimestamp) => {
        if (!unixTimestamp) return 'NOW PLAYING';
        return new Date(unixTimestamp * 1000).toLocaleDateString('en-AU', {
            day: '2-digit', month: 'short', year: 'numeric'
        });
    };

    const refreshRecentTracks = async () => {
        try {
        const response = await getRecentTracks(lastFmUsername);
        setRecentTracks(response.data.recenttracks.track);
        } catch (error) {
            console.error('Error refreshing recent tracks:', error);
        }
    };
 
    // extract the year the user registered on last fm from the unix timestamp
    const memberSince = userInfo
        ? new Date(userInfo.registered?.unixtime * 1000).getFullYear()
        : '...';
 
    // show loading screen while all api requests are sent
    if (loading) {
        return (
            <div className="amp-loading">
                <div className="amp-loading-icon">◈</div>
                <div className="amp-loading-text">// INITIALISING AMPLITUDE</div>
                <div className="amp-loading-sub">
                    FETCHING DATA FOR {lastFmUsername?.toUpperCase()}
                </div>
            </div>
        );
    }
 
    return (
        <div className="amp-root">
            {/* background overlay effects defined in css */}
            <div className="amp-scanlines" />
            <div className="amp-grid" />
 
            <div className="amp-content">
 
                {/* TOP BAR is a window title bar in the retro os aesthetic */}
                <div className="amp-topbar">
                    <span>AMPLITUDE // MUSIC INTELLIGENCE SYSTEM</span>
                    <span className="live">● LIVE</span>
                    <button className="amp-back-btn" onClick={() => navigate('/loggedin')}>
                        ← EXIT
                    </button>
                </div>
 
                {/* HERO displays user profile pic, username and key stats */}
                <div className="amp-hero">
                    {/* show last fm profile picture if available, otherwise show placeholder */}
                    {userInfo?.image && getImage(userInfo.image, 'extralarge') ? (
                        <img
                            src={getImage(userInfo.image, 'extralarge')}
                            alt={lastFmUsername}
                            className="amp-avatar"
                        />
                    ) : (
                        <div className="amp-avatar-placeholder">◈</div>
                    )}
                    <div>
                        <div className="amp-hero-label">// USER IDENTIFIED</div>
                        <h1 className="amp-username">{lastFmUsername}</h1>
                        <div className="amp-hero-meta">
                            MEMBER SINCE {memberSince} &nbsp;·&nbsp; LAST.FM NETWORK
                        </div>
                        {/* the key listening stats pulled from user.getinfo */}
                        <div className="amp-stats-row">
                            <div>
                                <div className="amp-stat-value">
                                    {parseInt(userInfo?.playcount || 0).toLocaleString()}
                                </div>
                                <div className="amp-stat-label">Total Scrobbles</div>
                            </div>
                            <div>
                                <div className="amp-stat-value">
                                    {parseInt(userInfo?.artist_count || 0).toLocaleString()}
                                </div>
                                <div className="amp-stat-label">Artists</div>
                            </div>
                            <div>
                                <div className="amp-stat-value">
                                    {parseInt(userInfo?.track_count || 0).toLocaleString()}
                                </div>
                                <div className="amp-stat-label">Tracks</div>
                            </div>
                        </div>
                    </div>
                </div>
 
                {/* RECENT TRACKS shows the last 15 scrobbled tracks */}
                <div className="amp-section">
                    <div className="amp-section-header">
                        <span className="amp-section-prefix">//</span>
                        RECENT TRANSMISSIONS
                        <button className="amp-back-btn" onClick={refreshRecentTracks}>↻ REFRESH</button>
                        <span className="amp-section-count">{recentTracks.length} TRACKS</span>
                    </div>
                    <div className="amp-track-list">
                        {/* slice to 15 tracks and map over each one */}
                        {recentTracks.slice(0, 15).map((track, index) => {
                           {/*last fm marks currently playing tracks with a nowplaying attribute*/}
                            const isNowPlaying = track['@attr']?.nowplaying === 'true';
                            // get medium sized album art for the track row
                            const imgSrc = getImage(track.image, 'medium');
                            return (
                                <div
                                    key={index}
                                    //  add now-playing class for special styling on the active track
                                    className={`amp-track-item${isNowPlaying ? ' now-playing' : ''}`}
                                >
                                    {/* track number padded to 2 digits e.g. 01, 02 */}
                                    <span className="amp-track-index">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    {/* show album art or music note placeholder */}
                                    {imgSrc ? (
                                        <img src={imgSrc} alt={track.name} className="amp-track-img" />
                                    ) : (
                                        <div className="amp-track-img-placeholder">♪</div>
                                    )}
                                    <div className="amp-track-info">
                                        <div className="amp-track-name">{track.name}</div>
                                        {/* artist name is stored under #text in the track object */}
                                        <div className="amp-track-artist">{track.artist['#text']}</div>
                                    </div>
                                    <div className="amp-track-date">
                                        {/* show animated now playing badge or formatted date */}
                                        {isNowPlaying ? (
                                            <span className="amp-now-playing-badge">▶ NOW PLAYING</span>
                                        ) : (
                                            formatDate(track.date?.uts)
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
 
                {/* TOP ARTISTS shows top 12 artists with album art */}
                <div className="amp-section">
                    <div className="amp-section-header">
                        <span className="amp-section-prefix">//</span>
                        TOP ARTISTS
                        <span className="amp-section-count">{topArtists.length} ENTITIES</span>
                    </div>
                    <div className="amp-grid-3">
                        {topArtists.slice(0, 12).map((artist, index) => {
                            // use album art instead of artist image since last fm removed artist images
                            // getArtistAlbumArt searches topAlbums for a matching artist name
                            const imgSrc = getArtistAlbumArt(artist.name);
                            return (
                                <div key={index} className="amp-card">
                                    {/* rank badge shows position */}
                                    <div className="amp-card-rank">#{index + 1}</div>
                                    {/* show album art or placeholder symbol */}
                                    {imgSrc ? (
                                        <img src={imgSrc} alt={artist.name} className="amp-card-img" />
                                    ) : (
                                        <div className="amp-card-img-placeholder">◈</div>
                                    )}
                                    <div className="amp-card-name">{artist.name}</div>
                                    <div className="amp-card-sub">
                                        {parseInt(artist.playcount).toLocaleString()} plays
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
 
                {/* TOP ALBUMS shows top 12 albums with cover art */}
                <div className="amp-section">
                    <div className="amp-section-header">
                        <span className="amp-section-prefix">//</span>
                        TOP ALBUMS
                        <span className="amp-section-count">{topAlbums.length} RECORDS</span>
                    </div>
                    <div className="amp-grid-3">
                        {topAlbums.slice(0, 12).map((album, index) => {
                            // album images still work fine
                            const imgSrc = getImage(album.image, 'large');
                            return (
                                <div key={index} className="amp-card">
                                    <div className="amp-card-rank">#{index + 1}</div>
                                    {imgSrc ? (
                                        <img src={imgSrc} alt={album.name} className="amp-card-img" />
                                    ) : (
                                        <div className="amp-card-img-placeholder">◈</div>
                                    )}
                                    <div className="amp-card-name">{album.name}</div>
                                    {/* show the artist name under the album title */}
                                    <div className="amp-card-sub">{album.artist?.name}</div>
                                    <div className="amp-card-sub">
                                        {parseInt(album.playcount).toLocaleString()} plays
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
 
                {/* FOOTER */}
                <div className="amp-footer">
                    <span>AMPLITUDE // DATA SOURCED FROM LAST.FM</span>
                    <span className="sys-ok">SYS.OK</span>
                </div>
 
            </div>
        </div>
    );
};
 
export default LastFmDashboard;