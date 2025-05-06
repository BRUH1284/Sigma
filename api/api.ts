import axios from 'axios';
import { AuthContext } from '@/context/AuthContext';
import { useContext } from 'react';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Create base Axios instance
export const api = axios.create({
    baseURL: API_URL
});

// Custom hook to access context inside api setup
// export const useApi = () => {
//     const { authState, onRefresh } = useContext(AuthContext);

//     // Set up request interceptor to attach access token
//     api.interceptors.request.use(
//         (config) => {
//             if (authState?.accessToken) {
//                 config.headers['Authorization'] = `Bearer ${authState.accessToken}`;
//             }
//             return config;
//         },
//         (error) => Promise.reject(error)
//     );

//     // Set up response interceptor for handling 401 + refresh
//     api.interceptors.response.use(
//         (response) => response,
//         async (error) => {
//             const originalRequest = error.config;

//             if (error.response?.status === 401 && !originalRequest._retry) {
//                 originalRequest._retry = true;

//                 try {
//                     const refreshed = await onRefresh?.();

//                     if (refreshed?.data?.accessToken) {
//                         api.defaults.headers.common['Authorization'] = `Bearer ${refreshed.data.accessToken}`;
//                         originalRequest.headers['Authorization'] = `Bearer ${refreshed.data.accessToken}`;
//                         return api(originalRequest);
//                     }
//                 } catch (refreshError) {
//                     // Optional: handle logout if refresh fails
//                     console.error('Token refresh failed', refreshError);
//                 }
//             }

//             return Promise.reject(error);
//         }
//     );

//     return api;
// };
