import axios from 'axios';

const axiosToBackend = axios.create({
    // baseURL: 'https://api.example.com', // Replace with your API base URL
    timeout: 5000, // Timeout after 5 seconds
});

axiosToBackend.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwt');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosToBackend;
