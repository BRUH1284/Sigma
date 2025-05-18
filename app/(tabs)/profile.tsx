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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserData } from '@/hooks/useUserData';
import { UserDataProvider } from '@/context/UserDataContext';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import PostCreationCard from '@/components/PostCreationCard';
// import { COLORS } from '@/constants/theme';

/**
 * Komponent zobrazenia vlastného používateľského profilu.
 * 
 * Obsahuje:
 * - osobné údaje (meno, profilový obrázok, počty followerov/priateľov)
 * - možnosť odhlásenia a prepnutia témy
 * - tvorbu nových postov
 * - zoznam existujúcich príspevkov
 *
 * Používa React hooky, kontexty a podporuje „pull to refresh“.
 * 
 * @returns React komponent profilu
 */
function MyProfileContent() {
    const { profile, posts, profileLoading, postsLoading, error, fetchMyProfile, fetchMyPosts, addNewPost } = useProfile();
    const { onLogout } = useAuth();
    const { checkRegistration } = useRegistration();
    const { userData } = useUserData();

    const [refreshing, setRefreshing] = useState(false);

    const styles = useStyles();
    const { colors, toggleTheme, isDark } = useTheme();

    /**
     * Odhlási používateľa a revaliduje registráciu.
     */
    const logout = async () => {
        if (!onLogout) {
            alert("Logout service is unavailable.");
            return;
        }
        await onLogout();
        await checkRegistration();
    };

    /**
     * Obnoví profilové údaje a príspevky (používa sa pri ťahaní nadol).
     */
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchMyProfile();
        console.log('profile fetched');
        await fetchMyPosts();
        console.log('posts fetched');
        setRefreshing(false);
    }, [fetchMyProfile]);

    /**
     * Vytvorí nový post a pokúsi sa ho pridať aj s prípadnou polohou.
     * @param content Text obsahu postu
     * @param images Pole obrázkov
     * @param location Geolokácia postu
     */
    const addPost = async (content: string, images: any[], location: { latitude: number; longitude: number } | null) => {
        try {
            await addNewPost(`${content}\n${!location?.latitude ? '' : `created at: ${location?.latitude} ${location?.longitude}`}`, images);
            onRefresh();
        } catch (error) {
            alert(`Failed to create post. ${error}`);
        }
    };

    useEffect(() => {
        fetchMyProfile();
        fetchMyPosts();
    }, []);

    if (profileLoading && !refreshing) return <ActivityIndicator />;

    if (!profile) return <Text>No profile data</Text>;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
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
                        <MaterialIcons name="exit-to-app" size={20} color="#000" />
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
                <View style={{ marginTop: 16 }}>
                    <PostCreationCard addNewPost={addPost}></PostCreationCard>
                </View>
                <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>My Posts</Text>
                <View style={{ width: '100%' }}>
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
        </SafeAreaView>
    );
}

/**
 * Hlavný wrapper komponent, ktorý poskytuje `UserDataContext` a renderuje `MyProfileContent`.
 *
 * @returns Komponent profilovej obrazovky s dátovým kontextom
 */
export default function MyProfile() {
    return (
        <UserDataProvider>

            <MyProfileContent />
        </UserDataProvider>
    );
}