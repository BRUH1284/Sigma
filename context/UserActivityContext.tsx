import React, {
    createContext,
    ReactNode,
} from 'react';
import { useDrizzleDb } from '@/hooks/useDrizzleDb';
import { UserActivity } from '@/db/schema';
import { UserActivityService } from '@/services/userActivityService';

interface UserActivityContextProps {
    getAllUserActivities: () => Promise<UserActivity[]>;
    syncUserActivities: () => Promise<void>;
    getUserActivityById: (id: string) => Promise<UserActivity>;
}

export const UserActivityContext = createContext<UserActivityContextProps | null>(null);

export const UserActivityProvider = ({ children }: { children: ReactNode }) => {
    const drizzleDb = useDrizzleDb();
    const service = UserActivityService(drizzleDb);


    const getAllUserActivities = async () => {
        return await service.getAllLocal();
    };

    const getUserActivityById = async (id: string) => {
        return (await service.getById(id))[0];
    };

    const syncUserActivities = async () => {
        return await service.sync();
    }

    return (
        <UserActivityContext.Provider
            value={{
                getAllUserActivities,
                syncUserActivities,
                getUserActivityById
            }}
        >
            {children}
        </UserActivityContext.Provider>
    );
};
