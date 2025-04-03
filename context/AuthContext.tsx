import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

interface AuthProps {
    authState?: { token: string | null; authenticated: boolean | null };
    onRegister?: (username: string, email: string, password: string) => Promise<any>;
    onLogin?: (username: string, password: string) => Promise<any>;
    onLogout?: () => Promise<any>;
}

const TOKEN_KEY = process.env.EXPO_PUBLIC_API_KEY;
const API_URL = process.env.EXPO_PUBLIC_API_URL;
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
    return useContext(AuthContext)
};

export const AuthProvider = ({ children }: any) => {
    if (TOKEN_KEY === undefined) return;

    const [authState, setAuthState] = useState<{
        token: string | null;
        authenticated: boolean | null
    }>({
        token: null,
        authenticated: null
    });

    useEffect(() => {
        const loadToken = async () => {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);

            if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                setAuthState({ token, authenticated: true });
            }
        };
        loadToken();
    }, []);

    const register = async (username: string, email: string, password: string) => {
        try {
            return await axios.post(`${API_URL}/account/register`, { username, email, password });
        } catch (e) {
            return { error: true, msg: (e as any).message, data: (e as any).response?.data };
        }
    };

    const login = async (username: string, password: string) => {
        try {
            const result = await axios.post(`${API_URL}/account/login`, { username, password });

            setAuthState({
                token: result.data.token,
                authenticated: true
            });

            axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.token}`;

            await SecureStore.setItemAsync(TOKEN_KEY, result.data.token);

            return result;
        } catch (e) {
            return { error: true, msg: (e as any).message, data: (e as any).response?.data };
        }
    };

    const logout = async () => {
        setAuthState({ token: null, authenticated: false });
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        axios.defaults.headers.common['Authorization'] = '';
    };

    const value = {
        onRegister: register,
        onLogin: login,
        onLogout: logout,
        authState
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
