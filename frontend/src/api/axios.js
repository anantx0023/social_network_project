import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
});

// Add JWT token to requests automatically
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Automatically set Content-Type based on data
    // If data is FormData (for file uploads), let browser set the Content-Type with boundary
    // Otherwise, use application/json
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
