import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Create base Axios instance
export const api = axios.create({
    baseURL: API_URL
});