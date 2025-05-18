import TextButton from '@/components/TextButton'
import TextField from '@/components/TextField';
// import { STYLES } from '@/constants/style';
import { useRegistration } from '@/hooks/useRegistration';
import { useRegistrationStep } from '@/hooks/useRegistrationStep';
import CircularProgress from '@/components/CircularProgress';
import { Stack, useRouter } from 'expo-router'
import { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, TouchableWithoutFeedback, View } from 'react-native'
import { COLORS } from '@/constants/theme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useStyles } from '@/constants/style';
import { useTheme } from '@/context/ThemeContext';

/**
 * Prvý krok registračného formulára – zadanie mena a priezviska používateľa.
 *
 * Komponent využíva validáciu pomocou `useRegistrationStep`, a ak sú vstupy validné, 
 * pokračuje na nasledujúci krok (`/physicalDetails`).
 *
 * Obsahuje indikátor pokroku (`CircularProgress`), textové polia (`TextField`) a tlačidlo pokračovania.
 *
 * @returns React komponent pre registráciu používateľa (meno/priezvisko)
 */
export default function Name() {
    const router = useRouter();

    const { registrationData, updateField } = useRegistration();
    const { validateStep } = useRegistrationStep(registrationData);

    const [nameError, setNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');

    const styles = useStyles();
    const { colors } = useTheme();

    /**
     * Skontroluje, či sú mená validné, a ak áno, presunie používateľa ďalej.
     */
    const handleNext = () => {
        const result = validateStep(0);

        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;

            setNameError(fieldErrors.firstName?.[0] || '');
            setLastNameError(fieldErrors.lastName?.[0] || '');
            return;
        }

        setNameError('');
        setLastNameError('');

        // move next
        router.push('/physicalDetails');
    };

    return (
        <>
            <Stack.Screen options={{ title: 'Personal Info' }} />
            <KeyboardAvoidingView
                behavior='padding'
                style={{ flex: 1 }}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <SafeAreaView style={{ flex: 1 }}>
                        <View style={[styles.containerAvoid, { alignItems: 'center' }]}>
                            <CircularProgress
                                size={128}
                                strokeWidth={12}
                                rings={[
                                    { color: colors.primary, progress: 0 }
                                ]}
                                icons={[
                                    { name: 'person', library: 'MaterialIcons' }
                                ]}
                            />
                            <TextField
                                label='First name'
                                errorMessage={nameError}
                                onChangeText={(val: any) => updateField('firstName', val)}
                                value={registrationData.firstName}
                            />
                            <TextField
                                label='Last name'
                                errorMessage={lastNameError}
                                onChangeText={(val: any) => updateField('lastName', val)}
                                value={registrationData.lastName}
                            />
                            <View style={{ flex: 1 }} />
                            <TextButton onPress={handleNext} title="Continue" />
                        </View>
                    </SafeAreaView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </>
    );
}
