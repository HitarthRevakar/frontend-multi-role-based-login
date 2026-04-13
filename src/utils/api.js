import axios from 'axios';

// Create an Axios instance
const LOCAL_API_URL = 'http://localhost:5000/api';
const LIVE_API_URL = 'https://backend-multi-role-based-login-1.onrender.com/api';

// Use live URL by default, or local URL if running on localhost
// You can manually override this by hardcoding baseURL to LOCAL_API_URL or LIVE_API_URL
const baseURL = window.location.hostname === 'localhost' ? LOCAL_API_URL : LIVE_API_URL;
// const baseURL = LIVE_API_URL; // Uncomment this to force live API even on localhost

const api = axios.create({
  baseURL,
});

// Intercept requests to add the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token may be expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
