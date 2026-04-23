import axios from 'axios';

const BASE_URL = 'https://ws.audioscrobbler.com/2.0';
const apiKey = process.env.REACT_APP_LASTFM_API_KEY;


// last fm api endpoint urls — all use the same base url with different method params
// format=json ensures we get json back instead of xml
export const getUserInfo = (username) => 
    axios.get(`${BASE_URL}/?method=user.getinfo&user=${username}&api_key=${apiKey}&format=json`);

export const getRecentTracks = (username) => 
    axios.get(`${BASE_URL}/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json`);

export const getTopArtists = (username) => 
    axios.get(`${BASE_URL}/?method=user.gettopartists&user=${username}&api_key=${apiKey}&format=json`);

export const getTopAlbums = (username) => 
    axios.get(`${BASE_URL}/?method=user.gettopalbums&user=${username}&api_key=${apiKey}&format=json`);

export const getAlbumAllData = (username, page) => 
    axios.get(`${BASE_URL}/?method=user.gettopalbums&user=${username}&api_key=${apiKey}&format=json&limit=50&page=${page}`)

export const getArtistAllData = (username, page) => 
    axios.get(`${BASE_URL}/?method=user.gettopartists&user=${username}&api_key=${apiKey}&format=json&limit=50&page=${page}`)
