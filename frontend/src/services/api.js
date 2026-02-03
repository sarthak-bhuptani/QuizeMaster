import axios from 'axios';

const getBaseUrl = () => {
    let url = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
    // If the URL doesn't end with /api, add it
    if (!url.endsWith('/api') && !url.endsWith('/api/')) {
        url = url.replace(/\/$/, '') + '/api';
    }
    return url;
};

const api = axios.create({
    baseURL: getBaseUrl(),
});

export default api;
