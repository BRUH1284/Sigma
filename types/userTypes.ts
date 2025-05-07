export interface UserProfile {
    userName: string,
    firstName: string,
    lastName: string,
    profilePictureUrl: string | null,
    bio: string,
    friendsVisible: boolean,
    friendCount: number,
    followersCount: number,
    followeeCount: number
}

export interface UserSummary {
    userName: string,
    firstName: string,
    lastName: string,
    profilePictureUrl: string | null
}