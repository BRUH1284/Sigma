import { useContext } from 'react';
import { ActivityRecordContext } from '@/context/ActivityRecordContext';

export const useActivityRecord = () => {
    const context = useContext(ActivityRecordContext);
    if (!context) {
        throw new Error('useActivityRecord must be used within an ActivityRecordProvider');
    }
    return context;
};
