import { View, Text, TextInput, Button, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { COLORS } from '@/constants/theme'
import { useAuth } from "@/context/AuthContext";
import { useRouter } from 'expo-router';

export default function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { onRegister } = useAuth();
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

    const register = async () => {
        if (!onRegister) {
            alert("Registration service is unavailable.");
            return;
        }

        const result = await onRegister(username, email, password);

        if (result?.error) {
            alert(result.msg);
        } else {
            router.replace("/(tabs)");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign up to Sigma</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                autoCapitalize="none"
                onChangeText={setUsername}
                value={username}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                autoCapitalize="none"
                onChangeText={setEmail}
                value={email}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                onChangeText={setPassword}
                value={password}
            />
            <Button onPress={register} title="Continue" />
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

