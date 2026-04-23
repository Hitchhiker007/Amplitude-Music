import React, { useEffect, useState } from 'react';
import { getArtistAllData, getAlbumAllData} from './service/lastFmService';
import { getAccount } from './service/auth';
import './css/LibraryArtist.css';

const user = getAccount();
const lastFmUsername = user.lastFmUsername;

const LibraryArtist = () => {

    // state hooks for storing all last fm data once fetched
    const [artists, setArtists] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [albumData, setAlbumData] = useState([]);

    // on mounc fetch all albums to avoid wasteful api calls
    useEffect(() => {
        const fetchAllAlbums = async () => {
            try {
                const firstPage = await getAlbumAllData(lastFmUsername, 1);
                const totalAlbumPages = parseInt(firstPage.data.topalbums['@attr'].totalPages);

                const remainingPages = await Promise.all(
                    Array.from({length: totalAlbumPages - 1}, (_, i) =>
                    getAlbumAllData(lastFmUsername, i + 2))
                )

                const allAlbums = [
                    ...firstPage.data.topalbums.album,
                    ...remainingPages.flatMap(page => page.data.topalbums.album)
                ];

                setAlbumData(allAlbums);
            } catch (error) {
                console.error('Error fetching all albums:', error);
            }
        };
        fetchAllAlbums();
    }, []); // empty array = run only once

    useEffect(() => {
        const fetchArtistData = async () => {
            try {

                // fetch artists and first album page simultaneously
                const artistResponse = await getArtistAllData(lastFmUsername, currentPage);
                
                setArtists(artistResponse.data.topartists.artist);
                setTotalPages(artistResponse.data.topartists['@attr'].totalPages);

                setLoading(false);


            } catch (error) {
            // catches network errors or unexpected response shapes
            console.error('Error connecting Last.fm account:', error);
            return console.error(503, { message: 'Could not connect to Last.fm, please try again!' });
            }
            
        }
        fetchArtistData()
    }, [currentPage])

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
        const album = albumData.find(a => a.artist.name === artistName);
        return album ? getImage(album.image, 'large') : null;
    };

    // calculate max playcount on current page for relative bar widths
    const maxPlaycount = Math.max(...artists.map(a => parseInt(a.playcount) || 0));
 
    // show loading screen while fetching
    if (loading) {
        return (
            <div className="lib-loading">
                <div className="lib-loading-icon">◈</div>
                <div className="lib-loading-text">LOADING LIBRARY</div>
                <div className="lib-loading-sub">FETCHING ARTISTS FOR {lastFmUsername?.toUpperCase()}</div>
            </div>
        );
    }
 
    return (
        <div className="lib-root">
            <div className="lib-content">
 
                {/* title bar */}
                <div className="lib-titlebar">
                    <span>AMPLITUDE // Artist LIBRARY</span>
                    <span className="lib-titlebar-sub">
                        PAGE {currentPage} OF {totalPages} &nbsp;·&nbsp; {lastFmUsername?.toUpperCase()}
                    </span>
                </div>
 
                {/* Artist list window */}
                <div className="lib-window">
                    <div className="lib-list">
                        {artists.map((artist, index) => {
                            const imgSrc = getArtistAlbumArt(artist.name);
                            const playcount = parseInt(artist.playcount) || 0;
                            // calculate bar width as % of max playcount on this page
                            const barWidth = maxPlaycount > 0 ? (playcount / maxPlaycount) * 100 : 0;
                            // global rank across all pages
                            const globalRank = (currentPage - 1) * 50 + index + 1;
                            return (
                                <div key={index} className="lib-artist-row">
                                    {/* global rank number */}
                                    <span className="lib-artist-rank">{globalRank}</span>
                                    {/* Artist art */}
                                    {imgSrc ? (
                                        <img src={imgSrc} alt={artist.name} className="lib-artist-img" />
                                    ) : (
                                        <div className="lib-artist-img-placeholder">♪</div>
                                    )}
                                    {/* Artist name and artist */}
                                    <div className="lib-artist-info">
                                        <div className="lib-artist-name">{artist.name}</div>
                                    </div>
                                    {/* playcount with relative bar */}
                                    <div className="lib-artist-playcount">
                                        <span className="lib-artist-playcount-num">
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
 
export default LibraryArtist;