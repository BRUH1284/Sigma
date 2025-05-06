import TextButton from '@/components/TextButton'
import TextField from '@/components/TextField';
import { STYLES } from '@/constants/style';
import { useRegistration } from '@/hooks/useRegistration';
import { useRegistrationStep } from '@/hooks/useRegistrationStep';
import CircularProgress from '@/components/CircularProgress';
import { Stack, useRouter } from 'expo-router'
import { useState } from 'react';
import { View } from 'react-native'
import { COLORS } from '@/constants/theme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function Name() {
    const router = useRouter();

    const { registrationData, updateField } = useRegistration();
    const { validateStep } = useRegistrationStep(registrationData);

    const [nameError, setNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');


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
            <View style={STYLES.container}>
                <CircularProgress
                    size={128}
                    strokeWidth={12}
                    rings={[
                        { color: COLORS.primary, progress: 0 }
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
                <View style={[STYLES.container, {
                    height: "auto",
                    alignSelf: "stretch",
                    justifyContent: 'flex-end',
                    marginBottom: 48
                }]}>
                    <TextButton onPress={handleNext} title="Continue" />
                </View>
            </View>
        </>
    );
}
