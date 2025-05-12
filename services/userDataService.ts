import { api } from "@/api/api";
import { UserData } from "@/types/registrationTypes";
import { AxiosError, AxiosResponse } from "axios";
import * as SecureStore from 'expo-secure-store';


const USER_DATA_KEY = 'USER_DATA';

let currentUserData: UserData | undefined = undefined;

export const clearUserData = async () => {
    await SecureStore.deleteItemAsync(USER_DATA_KEY);
    currentUserData = undefined;
}

export const loadUserData = async (): Promise<UserData | undefined> => {
    const stored = await SecureStore.getItemAsync(USER_DATA_KEY);
    if (stored) {
        currentUserData = JSON.parse(stored);
    }

    await api.get('/profiles/me/settings')
        .then((response: AxiosResponse) => {
            const data = response.data;

            const userData: UserData = {
                firstName: data.firstName,
                lastName: data.lastName,
                bio: data.bio,
                friendsVisible: data.friendsVisible,
                weight: data.weight,
                age: data.age,
                targetWeight: data.targetWeight,
                height: data.height,
                gender: data.gender,
                activityLevel: data.activityLevel,
                userClimate: data.userClimate,
                goal: data.goal
            };

            currentUserData = userData;

            SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(userData));
        })
        .catch((e: AxiosError) => {

        })

    return currentUserData;
}

export const getUserData = () => currentUserData;

export const setUserData = async (newUserData: UserData | undefined) => {
    if (newUserData)
        try {
            await api.put('/profiles/me/settings', newUserData);
        } catch {

        }

    await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(newUserData));

    currentUserData = newUserData;

    return newUserData;
};
