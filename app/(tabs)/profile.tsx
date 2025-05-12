import { View, Image, Text, Button, ActivityIndicator, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { useProfile } from '@/hooks/useProfile';
// import { STYLES } from '@/constants/style';
import { useStyles } from '@/constants/style';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { useRegistration } from '@/hooks/useRegistration';
import PostCard from '@/components/PostCard';
import { MaterialIcons } from '@expo/vector-icons';
// import { COLORS } from '@/constants/theme';

export default function MyProfile() {
    const { profile, posts, profileLoading, postsLoading, error, fetchMyProfile, fetchMyPosts } = useProfile();
    const { onLogout } = useAuth();
    const { checkRegistration } = useRegistration();

    const [refreshing, setRefreshing] = useState(false);

    const styles = useStyles();
    const { colors, toggleTheme, isDark } = useTheme();

    const logout = async () => {
        if (!onLogout) {
            alert("Logout service is unavailable.");
            return;
        }
        await onLogout();
        await checkRegistration();
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchMyProfile();
        console.log('profile fetched');
        await fetchMyPosts();
        console.log('posts fetched');
        setRefreshing(false);
    }, [fetchMyProfile]);

    useEffect(() => {
        fetchMyProfile();
        fetchMyPosts();
    }, []);

    if (profileLoading && !refreshing) return <ActivityIndicator />;

    if (error) return <Text>{error}</Text>;
    if (!profile) return <Text>No profile data</Text>;

    return (
        <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
                flexGrow: 1,
                padding: 16,
            }}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <View style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-between'
            }}>
                <Text style={styles.title}>@{profile.userName}</Text>
                <TouchableOpacity
                  style={{
                    height: 32,
                    aspectRatio: 1,
                    borderRadius: 32,
                    backgroundColor: colors.gray,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={toggleTheme}
                >
                  <MaterialIcons name={isDark ? "light-mode" : "dark-mode"} size={20} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        height: 32,
                        aspectRatio: 1,
                        borderRadius: 32,
                        backgroundColor: colors.gray,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    onPress={logout}
                >
                    <MaterialIcons name="settings" size={20} color="#000" />
                </TouchableOpacity>
            </View>
            <View
                style={{
                    gap: 16,
                    flexDirection: 'row',
                    width: '100%',
                    alignItems: 'flex-start',
                }}
            >
                <Image
                    style={{
                        width: 92,
                        height: 92,
                        borderRadius: 92
                    }}
                    resizeMode='cover'
                    source={
                        profile.profilePictureUrl
                            ? { uri: profile.profilePictureUrl }
                            : require('@/assets/images/default-avatar.png')
                    }
                />
                <View style={{ justifyContent: 'center', height: 92 }}>
                    <Text style={styles.text}>{profile.firstName} {profile.lastName}</Text>
                    <View style={{ flexDirection: 'row', gap: 16 }}>
                        <Text>
                            <Text style={styles.text}>{profile.followersCount}{'\n'}</Text>
                            <Text style={{ textDecorationLine: 'underline' }}>
                                followers{'\n'}
                            </Text>
                        </Text>
                        <Text>
                            <Text style={styles.text}>{profile.followeeCount}{'\n'}</Text>
                            <Text style={{ textDecorationLine: 'underline' }}>
                                following{'\n'}
                            </Text>
                        </Text>
                        <Text>
                            <Text style={styles.text}>{profile.friendCount}{'\n'}</Text>
                            <Text style={{ textDecorationLine: 'underline' }}>
                                friends{'\n'}
                            </Text>
                        </Text>
                    </View>
                </View>
            </View>
            <View style={{ width: '100%' }}>
                <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>My Posts</Text>
                {postsLoading ? (
                    <ActivityIndicator />
                ) : (!posts || posts!.length === 0) ? (
                    <Text>No posts yet.</Text>
                ) : (
                    posts!.map(post => (
                        <View key={post.id} style={{ marginBottom: 16 }}>
                            <PostCard post={post}></PostCard>
                        </View>
                    ))
                )}
            </View>
        </ScrollView>
    );
}
