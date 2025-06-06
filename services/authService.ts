import * as SecureStore from 'expo-secure-store';
import * as Application from 'expo-application';
import { api } from '@/api/api';
import { AxiosError } from 'axios';
import signalR, { HubConnectionBuilder } from '@microsoft/signalr';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const ACCESS_TOKEN_KEY = process.env.EXPO_PUBLIC_SECURE_ACCESS_TOKEN_KEY!;
const REFRESH_TOKEN_KEY = process.env.EXPO_PUBLIC_SECURE_REFRESH_TOKEN_KEY!;

let deviceId: string = '';
let accessToken: string | null = null;
let refreshToken: string | null = null;
let connection: signalR.HubConnection;

type AuthListener = (authenticated: boolean | null) => void;

const listeners = new Set<AuthListener>();


// Notify all listeners when tokens change
const notifyTokenUpdate = () => {
    const isAuthenticated = accessToken === null ? null : !!accessToken;

    console.log('notify:', isAuthenticated);
    listeners.forEach(listener => listener(isAuthenticated));
};

// Initialize device ID
// const initDeviceId = async (): Promise<void> => {
//     deviceId =
//         (await Application.getAndroidId?.()) ||
//         (await Application.getIosIdForVendorAsync()) ||
//         'UNKNOWN_DEVICE_ID';
// };
// initDeviceId();
const initDeviceId = async (): Promise<void> => {
    if (Platform.OS === 'android') {
        deviceId = await Application.getAndroidId() ?? 'UNKNOWN_ANDROID_ID';
    } else if (Platform.OS === 'ios') {
        deviceId = await Application.getIosIdForVendorAsync() ?? 'UNKNOWN_IOS_ID';
    } else {
        deviceId = 'UNKNOWN_PLATFORM';
    }

    console.log('📱 deviceId:', deviceId);
};

// Set in-memory tokens and attach to axios
const setTokens = (newAccess: string | null, newRefresh: string | null) => {
    accessToken = newAccess;
    refreshToken = newRefresh;
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    //console.log(`new access token: ${accessToken} \n new refresh token: ${refreshToken}`);
    notifyTokenUpdate(); // Notify listeners when tokens change
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
    console.log('load tokens');
    const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    setTokens(accessToken, refreshToken);
    if (accessToken === null) return null;
    return !!accessToken;
};

export const authService = {
    subscribeToTokenUpdates: (listener: AuthListener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
    },

    async onMessageReceived(callback: (sender: string, content: string, time: string) => void) {
        connection.on('ReceiveMessage', callback);
    },

    async stopConnection() {
        if (connection) {
            await connection.stop();
        }
    },

    async connectToChatHub() {
        console.log('try to connect to chathub with token:', accessToken);
        try {

            connection = new HubConnectionBuilder()
                .withUrl(`http://192.168.0.25:5294/chathub`, { // TODO: move to .env
                    accessTokenFactory: () => accessToken || '' // если нужно — сюда токен
                })
                .withAutomaticReconnect()
                .build();

        } catch (e) {
            console.log('failed to create connection', e);
        }

        console.log(connection);

        connection
            .start()
            .then(() => {
                console.log('SignalR connected');
            })
            .catch(console.error);
    },

    async register(username: string, email: string, password: string) {
        if (!deviceId) {
        await initDeviceId(); // 👈 гарантируем, что не будет пустым
        }
        const response = await api.post('/auth/register', {
            username,
            email,
            password,
            deviceId
        });

        const { accessToken, refreshToken } = response.data;
        await saveTokens(accessToken, refreshToken);
        const { data: expoPushToken } = await Notifications.getExpoPushTokenAsync();
        await authService.savePushToken(expoPushToken);
        return response;
    },

    async login(username: string, password: string) {
        if (!deviceId) {
        await initDeviceId(); // 👈 гарантируем, что не будет пустым
        }
        const response = await api.post('/auth/login', {
            username,
            password,
            deviceId
        });
        const { accessToken, refreshToken } = response.data;
        await saveTokens(accessToken, refreshToken);

        const { data: expoPushToken } = await Notifications.getExpoPushTokenAsync();
        await authService.savePushToken(expoPushToken);
        return response;
    },

    async refresh() {
        if (!refreshToken) throw new Error('No refresh token available');

        const response = await api.post('/auth/refresh-token', {
            oldAccessToken: accessToken,
            refreshToken,
            deviceId
        });

        await saveTokens(response.data.accessToken, response.data.refreshToken);
    },

    async logout() {
        await api.post('/auth/logout', { deviceId })
            .catch((e: AxiosError) => {
                console.log('Logout POST failed, ignoring:', e.message);
            });

        await clearTokens();
    },

    async savePushToken(expoPushToken: string) {
        if (!accessToken) return;
        await api.post('/notifications/token', {
            token: expoPushToken
        });
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

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        //console.log(originalRequest);

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes('/auth/refresh-token')
        ) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token: string) => {
                            originalRequest.headers['Authorization'] = `Bearer ${token}`;
                            resolve(api(originalRequest));
                        },
                        reject: (err: any) => reject(err)
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await authService.refresh();
                processQueue(null, accessToken);
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (err) {
                processQueue(err, null);
                await authService.clearTokens();
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);