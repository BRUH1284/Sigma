import { Image, View, Text } from 'react-native'
import React, { useState } from 'react'
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from 'expo-router';
import TextButton from '@/components/TextButton';
// import { STYLES } from '@/constants/style';
import { useStyles } from '@/constants/style';
import { useTheme } from '@/context/ThemeContext';
import TextField from '@/components/TextField';
import { useRegistration } from '@/hooks/useRegistration';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { onLogin } = useAuth();
    const { checkRegistration } = useRegistration();
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const styles = useStyles();
    const { colors } = useTheme();


    // Handle the change in username field
    const handleUsernameChange = (newUsername: string) => {
        setUsername(newUsername);
        // Clear username and error message when the user starts typing
        setUsernameMessage('');
        setErrorMessage('');
    };

    // Handle the change in password field
    const handlePasswordChange = (newPassword: string) => {
        setPassword(newPassword);
        // Clear password and error message when the user starts typing
        setPasswordMessage('');
        setErrorMessage('');
    };

    // Handle login process
    const login = async () => {
        // Check if authentication service is available
        if (!onLogin) {
            alert("Authentication service is unavailable.");
            return;
        }

        // Attempt to login with provided credentials
        const result = await onLogin(username, password);

        // Handle login result
        if (result.success) {
            await checkRegistration();
        } else {
            // Check for different types of error responses
            if (result.data === undefined) {
                alert(result.msg); // Show alert for undefined errors
            }
            if (result?.data.errors === undefined) {
                setErrorMessage(result.data); // Set general error message
                setPassword(''); // Clear password field
            }
            else {
                // Set field-specific error messages if available
                setUsernameMessage(result.data.errors.Username?.[0] ?? "");
                setPasswordMessage(result.data.errors.Password?.[0] ?? "");
                setErrorMessage(''); // Clear general error
            }
        }
    };

    return (

        <View style={styles.container}>
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
            <Text style={styles.title}>Sign in to Sigma</Text>
            <TextField
                placeholder="Username"
                errorMessage={usernameMessage}
                autoCapitalize="none"
                onChangeText={handleUsernameChange}
                value={username}
            />
            <TextField
                placeholder="Password"
                errorMessage={passwordMessage}
                secureTextEntry
                onChangeText={handlePasswordChange}
                value={password}
            />
            <View style={[styles.container, {
                height: "auto",
                alignSelf: "stretch",
                justifyContent: 'flex-end',
                marginBottom: 48
            }]}>
                <Text style={styles.errorText}>{errorMessage}</Text>
                <TextButton onPress={login} title="Sign in" />
            </View>
        </View>
    );
};

