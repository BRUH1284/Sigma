import React, { createContext, ReactNode } from 'react';
import { ActivityRecordService } from '@/services/activityRecordService';
import { useDrizzleDb } from '@/hooks/useDrizzleDb';
import { ActivityRecord } from '@/db/schema';

interface ActivityRecordContextProps {
    createRecord: (identificator: number | string, duration: number, kcal: number) => Promise<void>;
    getUnsyncedActivities: () => Promise<ActivityRecord[]>;
    markActivitiesAsSynced: (ids: string[]) => Promise<void>;
    getTodayActivitiesLocal: () => Promise<ActivityRecord[]>;
    getDayActivitiesLocal: (startOfDay: number) => Promise<ActivityRecord[]>;
    deleteRecord: (id: string) => Promise<void>;
    syncActivityRecords: () => Promise<void>;
}

export const ActivityRecordContext = createContext<ActivityRecordContextProps | null>(null);

export const ActivityRecordProvider = ({ children }: { children: ReactNode }) => {
    const drizzleDb = useDrizzleDb();
    const service = ActivityRecordService(drizzleDb);

    const createRecord = async (identificator: number | string, duration: number, kcal: number) => {
        await service.create(identificator, duration, kcal);
    };

    const getUnsyncedActivities = async () => {
        return await service.getUnsynced();
    };

    const markActivitiesAsSynced = async (ids: string[]) => {
        await service.markAsSynced(ids);
    };

    const getTodayActivitiesLocal = async () => {
        return await service.getTodayLocal();
    };

    const getDayActivitiesLocal = async (startOfDay: number) => {
        return await service.getDayLocal(startOfDay);
    };

    const deleteRecord = async (id: string) => {
        await service.deleteById(id, false);
    }

    const syncActivityRecords = async () => {
        await service.sync();
    }

    return (
        <ActivityRecordContext.Provider
            value={{
                createRecord,
                getUnsyncedActivities,
                markActivitiesAsSynced,
                getTodayActivitiesLocal,
                getDayActivitiesLocal,
                deleteRecord,
                syncActivityRecords
            }}
        >
            {children}
        </ActivityRecordContext.Provider>
    );
};