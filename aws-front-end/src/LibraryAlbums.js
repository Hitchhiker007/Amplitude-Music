import React, { useEffect, useState } from 'react';
import { getAlbumAllData } from './service/lastFmService';
import { getAccount } from './service/auth';
import './css/LibraryAlbum.css';



const LibraryAlbum = () => {

    const user = getAccount();
    const lastFmUsername = user.lastFmUsername;

    // state hooks for storing all last fm data once fetched
    const [albums, setAlbums] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAlbumData = async () => {
            try {
                const response = await getAlbumAllData(lastFmUsername, currentPage);

                setAlbums(response.data.topalbums.album);
                setTotalPages(response.data.topalbums['@attr'].totalPages);

                setLoading(false);


            } catch (error) {
            // catches network errors or unexpected response shapes
            console.error('Error connecting Last.fm account:', error);
            return console.error(503, { message: 'Could not connect to Last.fm, please try again!' });
            }
            
        }
        fetchAlbumData()
    }, [currentPage])

     // helper function to extract an image url from last fms image array
    const getImage = (images, size = 'large') => {
        if (!images) return null;
        const img = images.find(i => i.size === size);
        return img && img['#text'] ? img['#text'] : null;
    };

    // calculate max playcount on current page for relative bar widths
    const maxPlaycount = Math.max(...albums.map(a => parseInt(a.playcount) || 0));
 
    // show loading screen while fetching
    if (loading) {
        return (
            <div className="lib-loading">
                <div className="lib-loading-icon">◈</div>
                <div className="lib-loading-text">LOADING LIBRARY</div>
                <div className="lib-loading-sub">FETCHING ALBUMS FOR {lastFmUsername?.toUpperCase()}</div>
            </div>
        );
    }
 
    return (
        <div className="lib-root">
            <div className="lib-content">
 
                {/* title bar */}
                <div className="lib-titlebar">
                    <span>AMPLITUDE // ALBUM LIBRARY</span>
                    <span className="lib-titlebar-sub">
                        PAGE {currentPage} OF {totalPages} &nbsp;·&nbsp; {lastFmUsername?.toUpperCase()}
                    </span>
                </div>
 
                {/* album list window */}
                <div className="lib-window">
                    <div className="lib-list">
                        {albums.map((album, index) => {
                            const imgSrc = getImage(album.image, 'small');
                            const playcount = parseInt(album.playcount) || 0;
                            // calculate bar width as % of max playcount on this page
                            const barWidth = maxPlaycount > 0 ? (playcount / maxPlaycount) * 100 : 0;
                            // global rank across all pages
                            const globalRank = (currentPage - 1) * 50 + index + 1;
                            return (
                                <div key={index} className="lib-album-row">
                                    {/* global rank number */}
                                    <span className="lib-album-rank">{globalRank}</span>
                                    {/* album art */}
                                    {imgSrc ? (
                                        <img src={imgSrc} alt={album.name} className="lib-album-img" />
                                    ) : (
                                        <div className="lib-album-img-placeholder">♪</div>
                                    )}
                                    {/* album name and artist */}
                                    <div className="lib-album-info">
                                        <div className="lib-album-name">{album.name}</div>
                                        <div className="lib-album-artist">{album.artist.name}</div>
                                    </div>
                                    {/* playcount with relative bar */}
                                    <div className="lib-album-playcount">
                                        <span className="lib-album-playcount-num">
                                            {playcount.toLocaleString()} scrobbles
                                        </span>
                                        <div className="lib-playbar-bg">
                                            <div className="lib-playbar-fill" style={{ width: `${barWidth}%` }} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
 
                {/* pagination */}
                <div className="lib-pagination">
                    <button
                        className="lib-page-btn"
                        onClick={() => setCurrentPage(p => p - 1)}
                        disabled={currentPage === 1}
                    >
                        ← PREV
                    </button>
                    <span className="lib-page-info">
                        PAGE {currentPage} OF {totalPages}
                    </span>
                    <button
                        className="lib-page-btn"
                        onClick={() => setCurrentPage(p => p + 1)}
                        disabled={currentPage === parseInt(totalPages)}
                    >
                        NEXT →
                    </button>
                </div>
 
            </div>
        </div>
    );
};
 
export default LibraryAlbum;