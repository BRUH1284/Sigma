import { api } from '@/api/api';
import { UserProfile } from '@/types/userTypes';
import { UserData } from '@/types/registrationTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPost } from '@/types/postTypes';
import { AxiosError, AxiosResponse } from 'axios';

const USER_PROFILE_DATA_KEY = 'USER_PROFILE';

let currentProfileData: UserProfile | undefined = undefined;

export const profileService = {

    getProfileData(): UserProfile | undefined { return currentProfileData },

    async submitRegistration(data: UserData) {
        const response = await api.put('/profiles/me/settings', data);

        return response.data;
    },

    async clearRegistrationStatus() {
        await AsyncStorage.removeItem('isRegistered');
        await AsyncStorage.removeItem(USER_PROFILE_DATA_KEY);
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

    async getMyProfile(): Promise<UserProfile | undefined> {
        const stored = await AsyncStorage.getItem(USER_PROFILE_DATA_KEY);
        if (stored) {
            currentProfileData = JSON.parse(stored);
        }

        await api.get('/profiles/me')
            .then((response: AxiosResponse) => {
                const data = response.data;

                const profileData: UserProfile = {
                    userName: data.userName,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    profilePictureUrl: data.profilePictureUrl,
                    bio: data.bio,
                    friendsVisible: data.userName === 'true',
                    friendCount: Number(data.friendCount),
                    followersCount: Number(data.followersCount),
                    followeeCount: Number(data.followeeCount),
                };

                currentProfileData = profileData;

                AsyncStorage.setItem(USER_PROFILE_DATA_KEY, JSON.stringify(profileData));
            })
            .catch((e: AxiosError) => {

            })

        return currentProfileData;
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
    },

    async addNewPost(content: string, images: { uri: string, type: string, name: string }[]): Promise<void> {
        const formData = new FormData();

        formData.append('Content', content);

        images.forEach((image, index) => {
            formData.append('Images', {
                uri: image.uri,
                type: image.type,
                name: image.name,
            } as any);
        });

        try {
            const response = await api.post('/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        } catch (error) {
            console.error('Error creating post:', error);
            throw error;
        }
    }
};
