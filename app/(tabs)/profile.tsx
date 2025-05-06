import { View, Text, Button } from 'react-native'
import React from 'react'
import { useAuth } from '@/hooks/useAuth';
import { useRegistration } from '@/hooks/useRegistration';


export default function Profile() {

    const { onLogout, authState } = useAuth();
    const { checkRegistration } = useRegistration();
    const logout = async () => {
        if (!onLogout) {
            alert("Logout service is unavailable.");
            return;
        }

        await onLogout();
        await checkRegistration();
    }

    return (
        <View>
            <Text>Profile</Text>
            <Button onPress={logout} title='Logout'></Button>
        </View>
    )
}