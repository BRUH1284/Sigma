import React, {
    createContext,
    ReactNode,
} from 'react';
import { useDrizzleDb } from '@/hooks/useDrizzleDb';
import { Activity } from '@/db/schema';
import { ActivityService } from '@/services/activityService';

interface ActivityContextProps {
    getAllActivities: () => Promise<Activity[]>;
    syncActivities: () => Promise<void>;
    getActivityByCode: (code: number) => Promise<Activity>;
}

export const ActivityContext = createContext<ActivityContextProps | null>(null);

export const ActivityProvider = ({ children }: { children: ReactNode }) => {
    const drizzleDb = useDrizzleDb();
    const service = ActivityService(drizzleDb);


    const getAllActivities = async () => {
        return await service.getAllLocal();
    };

    const getActivityByCode = async (code: number) => {
        return (await service.getByCode(code))[0];
    };

    const syncActivities = async () => {
        return await service.sync();
    }


    return (
        <ActivityContext.Provider
            value={{
                getAllActivities,
                syncActivities,
                getActivityByCode
            }}
        >
            {children}
        </ActivityContext.Provider>
    );
};
