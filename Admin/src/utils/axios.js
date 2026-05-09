import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/api`,
  withCredentials: true, // IMPORTANT: Allows cookies to be sent with requests
});

export default api;
