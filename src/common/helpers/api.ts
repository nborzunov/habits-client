import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.PROD
        ? 'https://habits-server-production.up.railway.app/'
        : 'http://localhost:8080/',
});

export default api;
