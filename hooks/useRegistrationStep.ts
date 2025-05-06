import { RegistrationData } from '@/types/registrationTypes';
import { registrationSchema } from '@/validation/registrationSchema';

export function useRegistrationStep(registrationData: RegistrationData) {

    const steps: (keyof RegistrationData)[][] = [
        ['firstName', 'lastName'],
        ['weight', 'height', 'gender', 'activityLevel'],
        ['userClimate'],
        ['targetWeight', 'goal']
    ];

    const validateStep = (stepIndex: number) => {
        const fields = steps[stepIndex];
        const stepSchema = registrationSchema.pick(
            fields.reduce((acc, f) => ({ ...acc, [f]: true }), {}) as {
                [K in keyof RegistrationData]?: true;
            }
        );

        const dataToValidate = Object.fromEntries(
            fields.map((f) => [f, registrationData[f]])
        );

        return stepSchema.safeParse(dataToValidate);
    };

    return {
        steps,
        validateStep
    };
}
