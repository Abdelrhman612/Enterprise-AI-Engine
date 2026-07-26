import axios from 'axios';

// Create a custom axios instance pointing to the ASP.NET Core Backend
const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
