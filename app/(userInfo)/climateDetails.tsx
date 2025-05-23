import { View } from 'react-native';
import { useRegistrationStep } from '@/hooks/useRegistrationStep';
import { UserClimate } from '@/types/registrationTypes';
import { Stack, useRouter } from 'expo-router';
import { useRegistration } from '@/hooks/useRegistration';
import DropdownField from '@/components/DropdownField';
// import { STYLES } from '@/constants/style';
import { useStyles } from '@/constants/style';
import { useTheme } from '@/context/ThemeContext';
import TextButton from '@/components/TextButton';
import CircularProgress from '@/components/CircularProgress';
// import { COLORS } from '@/constants/theme';

/**
 * Obrazovka registrácie používateľa — výber klimatického pásma.
 *
 * Tento krok zhromažďuje informácie o prostredí, v ktorom používateľ žije.
 * Podporuje výber z klimatických možností pomocou `DropdownField` a validáciu kroku.
 *
 * @returns React komponent registračného kroku „Environment“
 */
export default function ClimateDetails() {
    const router = useRouter();

    const { registrationData, updateField } = useRegistration();
    const { validateStep } = useRegistrationStep(registrationData);

    /**
     * Skontroluje, či je krok validný a presunie používateľa na ďalší krok registrácie.
     */
    const handleNext = () => {
        const result = validateStep(2);

        if (!result.success) {
            return;
        }

        router.push('/goals');
    };

    /**
     * Položky pre výber klímy.
     */
    const climateItems = [
        { label: 'Tropical', value: UserClimate.Tropical },
        { label: 'Temperate', value: UserClimate.Temperate },
        { label: 'Cold', value: UserClimate.Cold },
    ];

    const styles = useStyles();
    const { colors } = useTheme();


    return (
        <>
            <Stack.Screen options={{ title: 'Environment' }} />
            <View style={[styles.containerAvoid, { alignItems: 'center' }]}>
                <CircularProgress
                    size={128}
                    strokeWidth={12}
                    rings={[
                        { color: colors.primary, progress: 0.5 }
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
                <View style={{ flex: 1 }} />
                <TextButton onPress={handleNext} title="Continue" />
            </View>
        </>
    );
}
