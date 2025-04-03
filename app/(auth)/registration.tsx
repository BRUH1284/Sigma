import { Image, View, Text, TextInput, Button, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { COLORS } from '@/constants/theme'
import { useAuth } from "@/context/AuthContext";
import { useRouter } from 'expo-router';
import TextField from '@/components/TextField';
import TextButton from '@/components/TextButton';
import { STYLES } from '@/constants/style';

export default function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { onRegister } = useAuth();
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('');
    const [emailMessage, setEmailMessage] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');

    // Handle the change in username field
    const handleUsernameChange = (newUsername: string) => {
        setUsername(newUsername);
        // Clear username and error message when the user starts typing
        setUsernameMessage('');
        setErrorMessage('');
    };

    // Handle the change in email field
    const handleEmailChange = (newEmail: string) => {
        setEmail(newEmail);
        // Clear email and error message when the user starts typing
        setEmailMessage('');
        setErrorMessage('');
    };

    // Handle the change in password field
    const handlePasswordChange = (newPassword: string) => {
        setPassword(newPassword);
        // Clear password and error message when the user starts typing
        setPasswordMessage('');
        setErrorMessage('');
    };

    const register = async () => {
        if (!onRegister) {
            alert("Registration service is unavailable.");
            return;
        }

        const result = await onRegister(username, email, password);

        // Handle registration result
        if (result?.error) {
            // Check for different types of error responses
            if (result.data === undefined) {
                alert(result.msg); // Show alert for undefined errors
            }
            if (result.data.errors === undefined) {
                // Set field-specific code messages if available
                if (result.data[0].description?.includes("Password"))
                    setPasswordMessage(result.data[0].description);
                else if (result.data[0].description?.includes("Username"))
                    setUsernameMessage(result.data[0].description);
                else // Set general error message
                    setErrorMessage(result.data[0].description ?? "Unknown error.");
            }
            else {
                // Set field-specific error messages if available
                setUsernameMessage(result.data.errors.Username?.[0] ?? "");
                setEmailMessage(result.data.errors.Email?.[0] ?? "");
                setPasswordMessage(result.data.errors.Password?.[0] ?? "");
                setErrorMessage(''); // Clear general error
            }
        } else {
            // On successful registration, navigate to welcome screen
            router.replace("/(tabs)");
        }
    };

    return (
        <View style={STYLES.container}>
            <Image
                style={{
                    alignSelf: "stretch",
                    height: 256,
                    margin: 32
                }}
                resizeMode="contain"
                source={{
                    uri: 'https://i1.sndcdn.com/avatars-IOXJvmseuTNrYtVh-mxzoUg-t240x240.jpg',
                }}></Image>
            <Text style={STYLES.title}>Sign up to Sigma</Text>
            <TextField
                placeholder="Username"
                errorMessage={usernameMessage}
                autoCapitalize="none"
                onChangeText={handleUsernameChange}
                value={username}
            />
            <TextField
                placeholder="Email"
                errorMessage={emailMessage}
                autoCapitalize="none"
                onChangeText={handleEmailChange}
                value={email}
            />
            <TextField
                placeholder="Password"
                errorMessage={passwordMessage}
                autoCapitalize="none"
                onChangeText={handlePasswordChange}
                value={password}
            />
            <View style={[STYLES.container, {
                height: "auto",
                alignSelf: "stretch",
                justifyContent: 'flex-end',
                marginBottom: 48
            }]}>
                <Text style={STYLES.errorText}>{errorMessage}</Text>
                <TextButton onPress={register} title="Continue" />
            </View>
        </View>
    );
};

