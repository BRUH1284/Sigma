import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRegistrationStep } from '@/hooks/useRegistrationStep';
import { Goal } from '@/types/registrationTypes';
import { Stack, useRouter } from 'expo-router';
import { useRegistration } from '@/hooks/useRegistration';
// import { STYLES } from '@/constants/style';
import TextButton from '@/components/TextButton';
import DropdownField from '@/components/DropdownField';
import TextField from '@/components/TextField';
import CircularProgress from '@/components/CircularProgress';
// import { COLORS } from '@/constants/theme';
import { useStyles } from '@/constants/style';
import { useTheme } from '@/context/ThemeContext';

export default function PhysicalDetails() {
    const router = useRouter();

    const { registrationData, updateField, submitRegistration } = useRegistration();
    const { validateStep } = useRegistrationStep(registrationData);

    const [weightError, setWeightError] = useState('');

    const styles = useStyles();
    const { colors } = useTheme();

    const handleNext = async () => {
        const result = validateStep(3);

        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;

            setWeightError(fieldErrors.targetWeight?.[0] || '');
            return;
        }

        const response = await submitRegistration();

        if (!response.success) {
            alert(response.msg);
            router.replace("/(auth)");
        }
    };

    const goalItems = [
        { label: 'Gain weight', value: Goal.GainWeight },
        { label: 'Gain weight fast', value: Goal.GainWeightFast },
        { label: 'Maintain weight', value: Goal.MaintainWeight },
        { label: 'Lose weight', value: Goal.LoseWeight },
        { label: 'Lose weight fast', value: Goal.LoseWeightFast },
    ];

    return (
        <>
            <Stack.Screen options={{ title: 'Goals' }} />
            <View style={styles.container}>
                <CircularProgress
                    size={128}
                    strokeWidth={12}
                    rings={[
                        { color: colors.primary, progress: 0.75, progressStart: 0.5 }
                    ]}
                    icons={[{ name: 'flag', library: 'MaterialIcons' }]}
                />
                <TextField
                    label='Target weight (kg)'
                    errorMessage={weightError}
                    onChangeText={(val) => updateField('targetWeight', +val || 0)}
                    value={registrationData.targetWeight.toString()}
                    keyboardType="numeric"
                />
                <DropdownField
                    label="Goal"
                    items={goalItems}
                    value={registrationData.goal}
                    onChangeValue={(val) => updateField('goal', val)}
                />

                <View style={[styles.container, {
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

// const styles = StyleSheet.create({
//     container: {
//         padding: 20,
//     },
//     input: {
//         borderWidth: 1,
//         borderColor: '#ccc',
//         padding: 8,
//         marginBottom: 10,
//     },
//     dropdown: {
//         marginBottom: 10,
//     },
//     error: {
//         color: 'red',
//         marginBottom: 10,
//     },
// });
