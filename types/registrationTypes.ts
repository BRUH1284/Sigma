export interface UserData {
    firstName: string;
    lastName: string;
    bio: string;
    friendsVisible: boolean;
    weight: number;
    targetWeight: number;
    height: number;
    gender: Gender;
    activityLevel: ActivityLevel;
    userClimate: UserClimate;
    goal: Goal;
}

export enum Gender {
    Male = 0,
    Female = 1,
}

export enum ActivityLevel {
    Sedentary = 0,
    Light = 1,
    Moderately = 2,
    High = 3,
    Extreme = 4
}

export enum UserClimate {
    Tropical = 0,
    Temperate = 1,
    Cold = 2,
}

export enum Goal {
    GainWeightFast = 0,
    GainWeight = 1,
    MaintainWeight = 2,
    LoseWeight = 3,
    LoseWeightFast = 4
}
