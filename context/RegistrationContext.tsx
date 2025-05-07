import { createContext, useEffect, useState } from 'react';
import { ActivityLevel, Gender, Goal, RegistrationData, UserClimate } from '@/types/registrationTypes';
import { profileService } from '@/services/profileService';
import { boolean } from 'zod';

const initialRegistrationData: RegistrationData = {
    firstName: '',
    lastName: '',
    bio: 'test bio',
    friendsVisible: true,
    weight: 0,
    targetWeight: 0,
    height: 0,
    gender: Gender.Male,
    activityLevel: ActivityLevel.Moderately,
    userClimate: UserClimate.Temperate,
    goal: Goal.MaintainWeight,
};


interface RegistrationContextProps {
    registrationData: RegistrationData;
    registrationState: RegistrationState;
    updateField: (field: keyof RegistrationData, value: any) => void;
    submitRegistration: () => Promise<{ success: boolean, msg?: string; data?: any }>;
    checkRegistration: () => Promise<boolean | null>;
    clearRegistration: () => void;
}

interface RegistrationState {
    registered: boolean | null;
}

export const RegistrationContext = createContext<RegistrationContextProps>({
    registrationData: initialRegistrationData,
    registrationState: { registered: false },
    updateField: () => { },
    submitRegistration: async () => ({ success: true, data: null }),
    checkRegistration: async () => null,
    clearRegistration: async () => null,
});

export const RegistrationProvider = ({ children }: any) => {
    const [registrationData, setRegistrationData] = useState<RegistrationData>(initialRegistrationData);
    const [registrationState, setRegistrationState] = useState<RegistrationState>({ registered: false });

    useEffect(() => {
        checkRegistration();
    }, []);

    const updateField = (field: keyof RegistrationData, value: any) => {
        setRegistrationData((prev) => ({ ...prev, [field]: value }));
    };

    const submitRegistration = async () => {
        try {
            await profileService.submitRegistration(registrationData);

            await profileService.setRegistrationStatus();
            setRegistrationState({ registered: true });
            return { success: true };
        } catch (error: any) {
            return {
                success: false,
                msg: error.message,
                data: error.response?.data,
            };
        }
    };

    const checkRegistration = async (): Promise<boolean | null> => {
        const isRegistered = await profileService.isRegistered();
        //console.log(`check registration: ${isRegistered}`);
        setRegistrationState({ registered: isRegistered });
        return isRegistered;
    };

    const clearRegistration = async () => {
        await profileService.clearRegistrationStatus();
    };

    return (
        <RegistrationContext.Provider value={{
            registrationData,
            registrationState,
            updateField,
            submitRegistration,
            checkRegistration,
            clearRegistration
        }}>
            {children}
        </RegistrationContext.Provider>
    );
};
