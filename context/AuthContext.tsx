import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "@/services/authService";
import { RegistrationContext } from "./RegistrationContext";

export interface AuthResult {
    success: boolean;
    msg?: string;
    data?: any;
}

interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    authenticated: boolean | null;
}

interface AuthContextProps {
    authState: AuthState;
    onRegister?: (username: string, email: string, password: string) => Promise<AuthResult>;
    onLogin?: (username: string, password: string) => Promise<AuthResult>;
    onLogout?: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>({
    authState: {
        accessToken: null,
        refreshToken: null,
        authenticated: null
    }
});

export const AuthProvider = ({ children }: any) => {
    const [authState, setAuthState] = useState<{
        accessToken: string | null;
        refreshToken: string | null;
        authenticated: boolean | null
    }>({
        accessToken: null,
        refreshToken: null,
        authenticated: null
    });

    useEffect(() => {
        const initializeAuth = async () => {
            const { accessToken, refreshToken } = await authService.loadStoredTokens();
            if (accessToken)
                setAuthState({ accessToken, refreshToken, authenticated: true });

        };

        initializeAuth();
    }, []);

    const register = async (
        username: string,
        email: string,
        password: string
    ): Promise<AuthResult> => {
        try {
            const response = await authService.register(username, email, password);

            const { accessToken, refreshToken } = response.data;

            // Update auth state with actual tokens
            setAuthState({ accessToken, refreshToken, authenticated: true });

            return { success: true };
        } catch (e) {
            return {
                success: false,
                msg: (e as any).message,
                data: (e as any).response?.data
            };
        }
    };

    const registrationContext = useContext(RegistrationContext);

    const login = async (username: string, password: string): Promise<AuthResult> => {
        try {
            const response = await authService.login(username, password);

            const { accessToken, refreshToken } = response.data;


            // Update auth state with actual tokens
            setAuthState({ accessToken, refreshToken, authenticated: true });
            registrationContext.checkRegistration();
            return { success: true };
        } catch (e) {
            return {
                success: false,
                msg: (e as any).message,
                data: (e as any).response?.data
            };
        }
    };

    const logout = async () => {
        await authService.logout();
        setAuthState({ accessToken: null, refreshToken: null, authenticated: false });
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

