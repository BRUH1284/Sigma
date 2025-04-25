import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import * as Application from 'expo-application';

interface AuthProps {
    authState?: { 
        accessToken: string | null; 
        refreshToken: string | null; 
        authenticated: boolean | null 
    };
    onRegister?: (
        username: string, 
        firstName: string, 
        lastName: string, 
        email: string, 
        password: string
    ) => Promise<any>;
    onLogin?: (username: string, password: string) => Promise<any>;
    onLogout?: () => Promise<any>;
}

const ACCESS_TOKEN_KEY = process.env.EXPO_PUBLIC_SECURE_ACCESS_TOKEN_KEY!;
const REFRESH_TOKEN_KEY = process.env.EXPO_PUBLIC_SECURE_REFRESH_TOKEN_KEY!;
const API_URL = process.env.EXPO_PUBLIC_API_URL;
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
    return useContext(AuthContext)
};

// Function to handle setting the tokens and updating the auth state
const handleAuthSuccess = async (accessToken: string, refreshToken: string, setAuthState: Function) => {
    setAuthState({
        accessToken,
        refreshToken,
        authenticated: true
    });

    // Set Authorization header with the access token
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

    // Store tokens in secure storage
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
};

export const AuthProvider = ({ children }: any) => {
    if (ACCESS_TOKEN_KEY === undefined || REFRESH_TOKEN_KEY === undefined) return;

    const [authState, setAuthState] = useState<{
        accessToken: string | null;
        refreshToken: string | null;
        authenticated: boolean | null
    }>({
        accessToken: null,
        refreshToken: null,
        authenticated: null
    });

    const [deviceId, setDeviceId] = useState<string>();

    useEffect(() => {
        const loadTokens = async () => {
            const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
            const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);

            if (accessToken) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                setAuthState({ accessToken, refreshToken, authenticated: true });
            }
        };

        const loadDeviceId = async () => {
            const id = Application.getAndroidId?.() || ((await Application.getIosIdForVendorAsync()) ?? 'UNKNOWN_DEVICE_ID');
            setDeviceId(id);
        };

        loadTokens();
        loadDeviceId();
    }, []);

    const register = async (
        username: string, 
        firstName: string, 
        lastName: string, 
        email: string, 
        password: string
    ) => {
        try {
            const result = await axios.post(`${API_URL}/auth/register`, { 
                username, 
                firstName, 
                lastName, 
                email, 
                password, 
                deviceId 
            });

            const { accessToken, refreshToken } = result.data;

            // Handle setting the tokens
            await handleAuthSuccess(accessToken, refreshToken, setAuthState);

            return result;
        } catch (e) {
            return { error: true, msg: (e as any).message, data: (e as any).response?.data };
        }
    };

    const login = async (username: string, password: string) => {
        try {
            const result = await axios.post(`${API_URL}/auth/login`, { 
                username, 
                password,
                deviceId 
            });

            const { accessToken, refreshToken } = result.data;

            // Handle setting the tokens
            await handleAuthSuccess(accessToken, refreshToken, setAuthState);

            return result;
        } catch (e) {
            return { error: true, msg: (e as any).message, data: (e as any).response?.data };
        }
    };

    const logout = async () => {
        setAuthState({ accessToken: null, refreshToken: null, authenticated: false });
        await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
        axios.defaults.headers.common['Authorization'] = ''; // Clear the auth header
    };

    const value = {
        onRegister: register,
        onLogin: login,
        onLogout: logout,
        authState
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
