import { View } from 'react-native';
import { useRegistrationStep } from '@/hooks/useRegistrationStep';
import { UserClimate } from '@/types/registrationTypes';
import { Stack, useRouter } from 'expo-router';
import { useRegistration } from '@/hooks/useRegistration';
import DropdownField from '@/components/DropdownField';
import { STYLES } from '@/constants/style';
import TextButton from '@/components/TextButton';
import CircularProgress from '@/components/CircularProgress';
import { COLORS } from '@/constants/theme';

export default function ClimateDetails() {
    const router = useRouter();

    const { registrationData, updateField } = useRegistration();
    const { validateStep } = useRegistrationStep(registrationData);

    const handleNext = () => {
        const result = validateStep(2);

        if (!result.success) {
            return;
        }

        router.push('/goals');
    };

    const climateItems = [
        { label: 'Tropical', value: UserClimate.Tropical },
        { label: 'Temperate', value: UserClimate.Temperate },
        { label: 'Cold', value: UserClimate.Cold },
    ];


    return (
        <>
            <Stack.Screen options={{ title: 'Environment' }} />
            <View style={STYLES.container}>
                <CircularProgress
                    size={128}
                    strokeWidth={12}
                    rings={[
                        { color: COLORS.primary, progress: 0.5, progressStart: 0.25 }
                    ]}
                    icons={[
                        { name: 'cloud-queue', library: 'MaterialIcons' }
                    ]}
                />
                <DropdownField
                    label="Climate"
                    items={climateItems}
                    value={registrationData.userClimate}
                    onChangeValue={(val) => updateField('userClimate', val)}
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
