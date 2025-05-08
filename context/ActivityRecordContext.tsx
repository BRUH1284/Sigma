import React, {
    createContext,
    useContext,
    ReactNode,
} from 'react';
import { ActivityRecordService } from '@/services/activityRecordService';
import { useDrizzleDb } from '@/hooks/useDrizzleDb';
import { ActivityRecord } from '@/db/schema';

interface ActivityRecordContextProps {
    createRecord: (activityCode: number, duration: number) => Promise<void>;
    getUnsyncedActivities: () => Promise<ActivityRecord[]>;
    markActivitiesAsSynced: (ids: number[]) => Promise<void>;
    getTodayActivities: () => Promise<ActivityRecord[]>;
}

export const ActivityRecordContext = createContext<ActivityRecordContextProps | null>(null);

export const ActivityRecordProvider = ({ children }: { children: ReactNode }) => {
    const drizzleDb = useDrizzleDb();
    const service = ActivityRecordService(drizzleDb);

    const createRecord = async (activityCode: number, duration: number) => {
        await service.create(activityCode, duration);
    };

    const getUnsyncedActivities = async () => {
        return await service.getUnsynced();
    };

    const markActivitiesAsSynced = async (ids: number[]) => {
        await service.markAsSynced(ids);
    };

    const getTodayActivities = async () => {
        return await service.getToday();
    };

    return (
        <ActivityRecordContext.Provider
            value={{
                createRecord,
                getUnsyncedActivities,
                markActivitiesAsSynced,
                getTodayActivities,
            }}
        >
            {children}
        </ActivityRecordContext.Provider>
    );
};

export function useActivityRecord() {
    const context = useContext(ActivityRecordContext);
    if (!context) throw new Error("useActivityRecord must be used within a ActivityRecordProvider");
    return context;
}
