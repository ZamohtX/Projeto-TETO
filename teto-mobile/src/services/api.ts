import axios from 'axios';


const API_URL = 'https://summer-thionic-holy.ngrok-free.dev';
const api = axios.create({
    baseURL: API_URL,
});

export default api;