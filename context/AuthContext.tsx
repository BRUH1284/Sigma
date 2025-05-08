import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "@/services/authService";
import { RegistrationContext } from "./RegistrationContext";

export interface AuthResult {
    success: boolean;
    msg?: string;
    data?: any;
}

interface AuthState {
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
        authenticated: null
    }
});

export const AuthProvider = ({ children }: any) => {
    const [authState, setAuthState] = useState<{
        authenticated: boolean | null
    }>({
        authenticated: null
    });

    useEffect(() => {
        const initializeAuth = async () => {
            const { accessToken } = await authService.loadStoredTokens();
            const newAuthState = !!accessToken;
            if (authState.authenticated != newAuthState)
                setAuthState({
                    authenticated: !!accessToken
                });
        };

        initializeAuth();

        // Subscribe to token updates from authService
        const unsubscribe = authService.subscribeToTokenUpdates(({ accessToken }) => {
            const newAuthState = !!accessToken;
            if (authState.authenticated != newAuthState)
                setAuthState({
                    authenticated: !!accessToken
                });
        });

        // Return cleanup function that doesn't return anything
        return () => {
            unsubscribe();
        };
    }, []);
    const register = async (
        username: string,
        email: string,
        password: string
    ): Promise<AuthResult> => {
        try {
            await authService.register(username, email, password);

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
            await authService.login(username, password);

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

