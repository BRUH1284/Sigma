import { Image, View, Text, Keyboard, KeyboardAvoidingView, SafeAreaView, TouchableWithoutFeedback } from 'react-native'
import React, { useState } from 'react'
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from 'expo-router';
import TextButton from '@/components/TextButton';
// import { STYLES } from '@/constants/style';
import { useStyles } from '@/constants/style';
import { useTheme } from '@/context/ThemeContext';
import TextField from '@/components/TextField';
import { useRegistration } from '@/hooks/useRegistration';

/**
 * Komponenta prihlasovacej obrazovky pre používateľov.
 *
 * Umožňuje zadať meno a heslo, overiť údaje a prihlásiť sa do aplikácie Sigma.
 * Obsahuje spracovanie chýb, prácu s klávesnicou a napojenie na autentifikačný servis.
 *
 * @returns React komponenta pre prihlásenie
 */
export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { onLogin } = useAuth();
    const { checkRegistration } = useRegistration();
    const [errorMessage, setErrorMessage] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const styles = useStyles();
    const router = useRouter();

    /**
     * Spracovanie zmeny používateľského mena
     * @param newUsername Nový text z inputu
     */
    // Handle the change in username field
    const handleUsernameChange = (newUsername: string) => {
        setUsername(newUsername);
        // Clear username and error message when the user starts typing
        setUsernameMessage('');
        setErrorMessage('');
    };

    /**
     * Spracovanie zmeny hesla
     * @param newPassword Nové heslo z inputu
     */
    // Handle the change in password field
    const handlePasswordChange = (newPassword: string) => {
        setPassword(newPassword);
        // Clear password and error message when the user starts typing
        setPasswordMessage('');
        setErrorMessage('');
    };

    /**
     * Pokus o prihlásenie používateľa cez `onLogin`
     * Vyhodnocuje výsledok a zobrazuje chybové správy podľa typu chyby.
     */
    // Handle login process
    const login = async () => {
        // Check if authentication service is available
        if (!onLogin) {
            alert("Authentication service is unavailable.");
            return;
        }

        // Attempt to login with provided credentials
        const result = await onLogin(username, password);
        console.log(result);

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
        <KeyboardAvoidingView
            behavior='padding'
            style={{ flex: 1 }}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView style={{ flex: 1 }}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.containerAvoid}>
                            <Image
                                style={{
                                    alignSelf: "center",
                                    height: 256,
                                    width: '100%',
                                    margin: 32
                                }}
                                resizeMode="contain"
                                source={require('@/assets/images/logo.png')}></Image>
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
                            <View style={{ flex: 1 }} />
                            <TextButton onPress={login} title="Sign in" />
                        </View>
                    </TouchableWithoutFeedback>
                </SafeAreaView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

