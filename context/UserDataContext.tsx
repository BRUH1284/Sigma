import { createContext, useEffect, useState } from 'react';
import { UserData } from '@/types/registrationTypes';
import { clearUserData, loadUserData, setUserData } from '@/services/userDataService';

interface UserDataContextProps {
    userData: UserData | undefined;
    loadData: () => Promise<void>;
    setData: (userData: UserData) => Promise<void>;
    setWeight: (weight: number) => Promise<void>;
    clearData: () => Promise<void>;
}

export const UserDataContext = createContext<UserDataContextProps | undefined>(undefined);

export const UserDataProvider = ({ children }: any) => {
    const [userData, setUserDataState] = useState<UserData>();

    useEffect(() => {
        (async () => {
            await loadData();
        })();
    }, []);

    const loadData = async (): Promise<void> => {
        const loaded = await loadUserData();
        setUserDataState(loaded);
    };

    const setData = async (userData: UserData): Promise<void> => {
        setUserDataState(userData);
        // sync
        await setUserData(userData);
    };

    const setWeight = async (weight: number): Promise<void> => {
        if (!userData)
            return;

        let newData = userData;
        newData.weight = weight;

        await setData(newData);
    }

    const clearData = async (): Promise<void> => {
        await clearUserData();
        setUserDataState(undefined);
    };

    return (
        <UserDataContext.Provider value={{
            userData,
            loadData,
            setData,
            setWeight,
            clearData
        }}>
            {children}
        </UserDataContext.Provider>
    );
};
