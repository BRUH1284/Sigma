import { UserDataContext } from '@/context/UserDataContext';
import { useContext } from 'react';

export const useUserData = () => {
    const context = useContext(UserDataContext);
    if (!context) throw new Error('useUserData must be used within UserDataProvider');
    return context;
};