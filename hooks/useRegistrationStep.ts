import { UserData } from '@/types/registrationTypes';
import { registrationSchema } from '@/validation/registrationSchema';

export function useRegistrationStep(registrationData: UserData) {

    const steps: (keyof UserData)[][] = [
        ['firstName', 'lastName'],
        ['age', 'weight', 'height', 'gender', 'activityLevel'],
        ['userClimate'],
        ['targetWeight', 'goal']
    ];

    const validateStep = (stepIndex: number) => {
        const fields = steps[stepIndex];
        const stepSchema = registrationSchema.pick(
            fields.reduce((acc, f) => ({ ...acc, [f]: true }), {}) as {
                [K in keyof UserData]?: true;
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
