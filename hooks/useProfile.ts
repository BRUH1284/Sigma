import { useState } from 'react';
import { profileService } from '@/services/profileService';
import { UserProfile } from '@/types/userTypes';
import { UserPost } from '@/types/postTypes';

export function useProfile() {
    const [profile, setProfile] = useState<UserProfile>();
    const [posts, setPosts] = useState<UserPost[]>();
    const [profileLoading, setProfileLoading] = useState(false);
    const [postsLoading, setPostsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchMyProfile = async () => {
        setProfileLoading(true);
        setError(null);
        try {
            const data = await profileService.getMyProfile();
            setProfile(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load profile');
        } finally {
            setProfileLoading(false);
        }
    };
    const fetchMyPosts = async () => {
        setPostsLoading(true);
        setError(null);
        try {
            const data = await profileService.getMyPosts();
            setPosts(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load profile');
        } finally {
            setPostsLoading(false);
        }
    };

    const addNewPost = async (content: string, images: { uri: string, type: string, name: string }[]) => {
        await profileService.addNewPost(content, images);
    };

    return {
        profile,
        posts,
        profileLoading,
        postsLoading,
        error,
        fetchMyProfile,
        fetchMyPosts,
        addNewPost
    };
}
