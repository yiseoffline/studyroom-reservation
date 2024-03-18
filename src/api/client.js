import axios from 'axios';

export const API_URL = 'http://222.232.240.42:8080';

export const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
