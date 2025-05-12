import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Create base Axios instance
export const api = axios.create({
    baseURL: 'http://192.168.0.25:5294/api'
});