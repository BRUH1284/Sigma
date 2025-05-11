import { authService } from "@/services/authService";
import { createContext, useContext, useEffect, useState } from "react";


interface MessengerContextProps {
    connectToChatHub: () => Promise<void>;
    onMessageReceived: (callback: (sender: string, content: string, time: string) => void) => void;
    stopConnection: () => Promise<void>;
}

export const MessengerContext = createContext<MessengerContextProps>({
    connectToChatHub: async () => { },
    onMessageReceived: () => { },
    stopConnection: async () => { },
});

export const MessengerProvider = ({ children }: any) => {
    const connectToChatHub = async () => {
        await authService.connectToChatHub();
    };
    const onMessageReceived = (callback: (sender: string, content: string, time: string) => void) => {
        authService.onMessageReceived(callback);
    };
    const stopConnection = async () => {
        await authService.stopConnection();
    };

    const value = {
        connectToChatHub,
        onMessageReceived,
        stopConnection
    };

    return (
        <MessengerContext.Provider value={value}>
            {children}
        </MessengerContext.Provider>
    );
};

