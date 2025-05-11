import { authService } from "@/services/authService";
import { createContext } from "react";


interface MessengerContextProps {
    connectToChatHub: () => Promise<void>;
    onMessageReceived: (callback: (sender: string, content: string, time: string) => void) => Promise<void>;
    stopConnection: () => Promise<void>;
}


export const MessengerContext = createContext<MessengerContextProps | null>(null);

export const MessengerProvider = ({ children }: any) => {
    const service = authService;
    const connectToChatHub = async () => {
        console.log('try to connect');
        await service.connectToChatHub();
    };
    const onMessageReceived = async (callback: (sender: string, content: string, time: string) => void) => {
        await service.onMessageReceived(callback);
    };
    const stopConnection = async () => {
        await service.stopConnection();
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

