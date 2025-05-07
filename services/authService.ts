import * as SecureStore from 'expo-secure-store';
import * as Application from 'expo-application';
import { api } from '@/api/api';
import { profileService } from './profileService';
import { useRegistration } from '@/hooks/useRegistration';

const ACCESS_TOKEN_KEY = process.env.EXPO_PUBLIC_SECURE_ACCESS_TOKEN_KEY!;
const REFRESH_TOKEN_KEY = process.env.EXPO_PUBLIC_SECURE_REFRESH_TOKEN_KEY!;

let deviceId: string = '';
let accessToken: string | null = null;
let refreshToken: string | null = null;


// Initialize device ID
const initDeviceId = async (): Promise<void> => {
    deviceId =
        (await Application.getAndroidId?.()) ||
        (await Application.getIosIdForVendorAsync()) ||
        'UNKNOWN_DEVICE_ID';
};
initDeviceId();

// Set in-memory tokens and attach to axios
const setTokens = (newAccess: string | null, newRefresh: string | null) => {
    accessToken = newAccess;
    refreshToken = newRefresh;
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    //console.log(`new access token: ${accessToken} \n new refresh token: ${refreshToken}`);
};

// Save tokens to secure store
const saveTokens = async (newAccess: string, newRefresh: string) => {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, newAccess);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, newRefresh);
    setTokens(newAccess, newRefresh);
};

// Clear saved tokens
const clearTokens = async () => {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    setTokens(null, null);
};

const loadStoredTokens = async () => {
    const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    setTokens(accessToken, refreshToken);
    return { accessToken, refreshToken };
};

export const authService = {
    async register(username: string, email: string, password: string) {

        const response = await api.post('/auth/register', {
            username,
            email,
            password,
            deviceId
        });

        const { accessToken, refreshToken } = response.data;
        await saveTokens(accessToken, refreshToken);
        return response;
    },

    async login(username: string, password: string) {
        const response = await api.post('/auth/login', {
            username,
            password,
            deviceId
        });
        const { accessToken, refreshToken } = response.data;
        await saveTokens(accessToken, refreshToken);
        return response;
    },

    async refresh() {
        if (!refreshToken) throw new Error('No refresh token available');

        const response = await api.post('/auth/refresh-token', {
            oldAccessToken: accessToken,
            refreshToken,
            deviceId
        });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
        await saveTokens(newAccessToken, newRefreshToken);
        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    },

    async logout() {
        await api.post('/auth/logout', { deviceId });
        await clearTokens();
        await profileService.clearRegistrationStatus();
    },

    loadStoredTokens,
    clearTokens
};

// Set up interceptors ONCE
api.interceptors.request.use(
    (config) => {
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Avoid infinite loop on refresh endpoint
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes('/auth/refresh-token') &&
            error.response?.data != null
        ) {
            originalRequest._retry = true;

            try {
                const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await authService.refresh();
                await saveTokens(newAccessToken, newRefreshToken);
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (err) {
                console.log('Token refresh failed:', (err as any).message);
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);
