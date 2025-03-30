import { View, Text, Button } from 'react-native'
import React from 'react'
import { useAuth } from '@/context/AuthContext';


export default function Profile() {

    const { onLogout, authState } = useAuth();
    const logout = async () => {
        if (!onLogout) {
            alert("Logout service is unavailable.");
            return;
        }

        console.log(authState);
        await onLogout();
        console.log(authState);
    }

    return (
        <View>
            <Text>Profile</Text>
            <Button onPress={logout} title='Logout'></Button>
        </View>
    )
}