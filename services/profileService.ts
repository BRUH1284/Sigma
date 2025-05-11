import { api } from '@/api/api';
import { UserProfile } from '@/types/userTypes';
import { RegistrationData } from '@/types/registrationTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPost } from '@/types/postTypes';

export const profileService = {

    async submitRegistration(data: RegistrationData) {
        const response = await api.put('/profiles/me/settings', data);

        return response.data;
    },

    async clearRegistrationStatus() {
        await AsyncStorage.removeItem('isRegistered');
    },

    async setRegistrationStatus() {
        await AsyncStorage.setItem('isRegistered', 'true');
    },

    async isRegistered(): Promise<boolean> {
        const isRegistered = await AsyncStorage.getItem('isRegistered');

        if (isRegistered != null)
            return isRegistered === 'true';

        try {
            const response = await api.get('/profiles/me/settings');

            const isRegistered = response.data.weight != '0';
            if (isRegistered)
                this.setRegistrationStatus();

            return isRegistered;
        } catch {
            return false;
        }
    },

    async getMyProfile(): Promise<UserProfile> {
        const response = await api.get('/profiles/me');

        const profileData = response.data;

        return {
            userName: profileData.userName,
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            profilePictureUrl: profileData.profilePictureUrl,
            bio: profileData.bio,
            friendsVisible: profileData.userName === 'true',
            friendCount: Number(profileData.friendCount),
            followersCount: Number(profileData.followersCount),
            followeeCount: Number(profileData.followeeCount),
        }
    },

    async getMyPosts(): Promise<UserPost[]> {
        const response = await api.get('/profiles/me/posts');

        const postsData = response.data;

        const posts: UserPost[] = postsData.map((post: any) => ({
            id: post.id,
            author: {
                userName: post.author.userName,
                firstName: post.author.firstName,
                lastName: post.author.lastName,
                profilePictureUrl: post.author.profilePictureUrl,
            },
            content: post.content,
            imageUrls: post.imageUrls || [],
            createdAt: new Date(post.createdAt),
        }));

        return posts;
    }
};
