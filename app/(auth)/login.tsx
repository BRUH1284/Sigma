import { View, Text, TextInput, Button, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { COLORS } from '@/constants/theme'
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useRouter } from 'expo-router';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { onLogin } = useAuth();
    const router = useRouter();

    // useEffect(() => {
    //     const testCall = async () => {
    //         try {
    //             const result = await axios.get(`${API_URL}/activity`);
    //             console.log('res:', result.status);
    //         } catch (error) {
    //             console.error('API Error:', error); // ✅ Logs full error object
    //             if (axios.isAxiosError(error)) {
    //                 console.error('Error Response:', error.response?.data); // ✅ Logs API error response
    //             }
    //         }
    //     };
    //     testCall();
    // })

    const login = async () => {
        if (!onLogin) {
            alert("Authentication service is unavailable.");
            return;
        }

        const result = await onLogin(username, password);

        if (result?.error) {
            alert(result.msg);
        } else {
            router.replace("/(tabs)");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign in to Sigma</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                autoCapitalize="none"
                onChangeText={setUsername}
                value={username}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                onChangeText={setPassword}
                value={password}
            />
            <Button onPress={login} title="Sign in" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 16
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20
    },
    input: {
        width: "80%",
        height: 40,
        borderWidth: 1,
        borderColor: COLORS.dark,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 10,
    }
});

