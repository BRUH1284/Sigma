import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Stack, useRouter, useSegments } from 'expo-router';

export default function InitialLayout() {
    const { authState } = useAuth();

    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        const inAuthScreen = segments[0] == "(auth)";

        if (!authState?.authenticated && !inAuthScreen)
            router.replace("/(auth)");
        else if (authState?.authenticated && inAuthScreen)
            router.replace("/(tabs)");
    }, [authState]);

    return <Stack screenOptions={{ headerShown: false }} />;
}