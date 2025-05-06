import { api } from '@/api/api';
import { RegistrationData } from '@/types/registrationTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const profileService = {
    async submitRegistration(data: RegistrationData) {
        const response = await api.put('/profiles/me/settings', data);

        return response.data;
    },

    async clearRegistrationStatus() {
        await AsyncStorage.removeItem('isRegistered');
    },

    async setRegistrationStatus() {
        await AsyncStorage.setItem('isRegistered', 'true');
    },

    async isRegistered(): Promise<boolean | null> {
        const isRegistered = await AsyncStorage.getItem('isRegistered') === 'true';

        if (isRegistered != null)
            return isRegistered;

        const response = await api.get('/profiles/me/settings');

        return response.data.weight ? response.data.weight === '0' : null;
    }
};
