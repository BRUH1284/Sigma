import { useContext } from 'react';
import { MessengerContext } from '../context/MessengerContext';

export const useMessenger = () => {
    const context = useContext(MessengerContext);
    if (!context) {
        throw new Error('useMessenger must be used within MessengerProvider');
    }
    return context;
};