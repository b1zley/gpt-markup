import axios from 'axios';
import Cookies from 'js-cookie'
const axiosToBackend = axios.create({
    // baseURL: 'https://api.example.com', 
    timeout: 5000, // Timeout after 5 seconds
});

axiosToBackend.interceptors.request.use(
    (config) => {
        const token = Cookies.get('jwt');
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
