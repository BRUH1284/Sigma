import { ActivityLevel, Gender, UserClimate, UserData } from "@/types/registrationTypes";

export const metCalculator = (met: number, minutes: number, weight: number) => {
    const result = weight * met * minutes / 60;

    return Math.round(result);
};

// Mifflin-St Jeor Equation
export const rmrCalculator = (userData?: UserData) => {
    if (!userData)
        return 0;


    const genderValue = userData.gender === Gender.Male ? 5 : -161;

    let activityMultiplier = 0;
    switch (userData.activityLevel) {
        case ActivityLevel.Sedentary:
            activityMultiplier = 1.2;
            break;
        case ActivityLevel.Light:
            activityMultiplier = 1.375;
            break;
        case ActivityLevel.Moderately:
            activityMultiplier = 1.55;
            break;
        case ActivityLevel.High:
            activityMultiplier = 1.725;
            break;
        case ActivityLevel.Extreme:
            activityMultiplier = 1.9;
            break;
    }

    const result =
        ((10 * userData.weight) +
            (6.25 * userData.height) -
            (5 * userData.age) +
            genderValue) *
        activityMultiplier;

    return Math.round(result);
};
// Daily water intake calculator 
export const waterCalculator = (userData?: UserData) => {
    if (!userData)
        return 0;
    const genderMultiplier = userData.gender === Gender.Male ? 0.67 : 0.5;

    const weightMultiplier = genderMultiplier * userData.weight;

    let activityValue = 0;
    switch (userData.activityLevel) {
        case ActivityLevel.Sedentary:
            activityValue = 0.09;
            break;
        case ActivityLevel.Light:
            activityValue = 0.18;
            break;
        case ActivityLevel.Moderately:
            activityValue = 0.35;
            break;
        case ActivityLevel.High:
            activityValue = 0.7;
            break;
        case ActivityLevel.Extreme:
            activityValue = 0.95;
            break;
    }

    let climateValue = 0;
    switch (userData.userClimate) {
        case UserClimate.Cold:
            climateValue = 0.2;
            break;
        case UserClimate.Temperate:
            climateValue = 0;
            break;
        case UserClimate.Tropical:
            climateValue = 0.5;
            break;
    }

    const result = weightMultiplier + activityValue + climateValue;
    return Math.round(result * 10) / 10;
}

