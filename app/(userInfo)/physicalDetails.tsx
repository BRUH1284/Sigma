import { useState } from 'react';
import { View, ScrollView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useRegistrationStep } from '@/hooks/useRegistrationStep';
import { ActivityLevel, Gender } from '@/types/registrationTypes';
import { Stack, useRouter } from 'expo-router';
import { useRegistration } from '@/hooks/useRegistration';
import TextField from '@/components/TextField';
import DropdownField from '@/components/DropdownField';
import TextButton from '@/components/TextButton';
import CircularProgress from '@/components/CircularProgress';
import { useStyles } from '@/constants/style';
import { useTheme } from '@/context/ThemeContext';

export default function PhysicalDetails() {
    const router = useRouter();

    const { registrationData, updateField } = useRegistration();
    const { validateStep } = useRegistrationStep(registrationData);

    const [ageError, setAgeError] = useState('');
    const [weightError, setWeightError] = useState('');
    const [heightError, setHeightError] = useState('');

    const styles = useStyles();
    const { colors } = useTheme();

    const handleNext = () => {
        const result = validateStep(1);

        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;

            setWeightError(fieldErrors.weight?.[0] || '');
            setHeightError(fieldErrors.height?.[0] || '');
            setAgeError(fieldErrors.age?.[0] || '');
            return;
        }

        setWeightError('');
        setHeightError('');
        setAgeError('');

        // Here, you would navigate to the next screen explicitly (e.g., router.push('/next-step'))
        router.push('/climateDetails');
    };

    const genderItems = [
        { label: 'Male', value: Gender.Male },
        { label: 'Female', value: Gender.Female },
    ];
    const activityItems = [
        { label: 'Sedentary', value: ActivityLevel.Sedentary },
        { label: 'Light', value: ActivityLevel.Light },
        { label: 'Moderately', value: ActivityLevel.Moderately },
        { label: 'High', value: ActivityLevel.High },
        { label: 'Extreme', value: ActivityLevel.Extreme },
    ];

    return (
        <>
            <Stack.Screen options={{ title: 'Physical Details' }} />
            <ScrollView>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={[styles.containerAvoid, { flex: 1 }]}>
                        <ScrollView contentContainerStyle={styles.container}>
                            <CircularProgress
                                size={128}
                                strokeWidth={12}
                                rings={[
                                    { color: colors.primary, progress: 0.25 }
                                ]}
                                icons={[
                                    { name: 'body', library: 'Ionicons' }
                                ]}
                            />
                            <TextField
                                label='Age'
                                errorMessage={ageError}
                                onChangeText={(val) => updateField('age', +val || 0)}
                                value={registrationData.age.toString()}
                                keyboardType="numeric"
                            />
                            <TextField
                                label='Weight (kg)'
                                errorMessage={weightError}
                                onChangeText={(val) => updateField('weight', +val || 0)}
                                value={registrationData.weight.toString()}
                                keyboardType="numeric"
                            />
                            <TextField
                                label='Height (cm)'
                                errorMessage={heightError}
                                onChangeText={(val) => updateField('height', +val || 0)}
                                value={registrationData.height.toString()}
                                keyboardType="numeric"
                            />
                            <DropdownField
                                label="Gender"
                                items={genderItems}
                                value={registrationData.gender}
                                onChangeValue={(val) => updateField('gender', val)}
                                zIndex={1000}
                                dropdownDirection='TOP'
                            />
                            <DropdownField
                                label="Activity Level"
                                items={activityItems}
                                value={registrationData.activityLevel}
                                onChangeValue={(val) => updateField('activityLevel', val)}
                                zIndex={2000}
                                dropdownDirection='TOP'
                            />
                        </ScrollView>
                        <TextButton onPress={handleNext} title="Continue" />
                    </View>
                </TouchableWithoutFeedback>
            </ScrollView>
        </>
    );
}
