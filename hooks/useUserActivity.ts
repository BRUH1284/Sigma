import { useContext } from 'react';
import { UserActivityContext } from '@/context/UserActivityContext';

export const useUserActivity = () => {
    const context = useContext(UserActivityContext);
    if (!context) {
        throw new Error('useUserActivity must be used within an UserActivityProvider');
    }
    return context;
};
