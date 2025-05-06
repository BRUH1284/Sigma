import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Stack, useRouter, useSegments } from 'expo-router';
import { useRegistration } from '@/hooks/useRegistration';

export default function InitialLayout() {
    const { authState } = useAuth();
    const { registrationState } = useRegistration();

    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        const inAuthScreen = segments[0] == "(auth)";

        console.log(`init update: ${authState.authenticated} :::: ${authState.refreshToken} :::: ${registrationState.registered}`);

        if (!authState?.authenticated && !inAuthScreen)
            router.replace("/(auth)");
        else if (authState?.authenticated) {
            if (registrationState == null)
                router.replace("/(auth)");
            else if (registrationState.registered)
                router.replace("/(tabs)");
            else
                router.replace("/(userInfo)");
        }
    }, [authState, registrationState]);

    return <View />;
}