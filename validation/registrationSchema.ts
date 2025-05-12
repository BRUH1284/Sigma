import { z } from 'zod';

export const registrationSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    bio: z.string().optional(),
    friendsVisible: z.boolean(),
    age: z.number().min(1, 'Age must be greater than 0'),
    weight: z.number().min(1, 'Weight must be greater than 0'),
    targetWeight: z.number().min(1, 'Target weight must be greater than 0'),
    height: z.number().min(1, 'Height must be greater than 0'),
    gender: z.number().int().min(0),
    activityLevel: z.number().int().min(0),
    userClimate: z.number().int().min(0),
    goal: z.number().int().min(0),
});
