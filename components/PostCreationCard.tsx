import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, FlatList, StyleSheet, TouchableOpacity, Alert, Switch } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

const PostCreationCard = ({ addNewPost }: { addNewPost: Function }) => {
    const [postContent, setPostContent] = useState('');
    const [selectedImages, setSelectedImages] = useState<any[]>([]);
    const [includeLocation, setIncludeLocation] = useState(false);
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

    const requestLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission denied', 'Location permission is required to add location.');
                setIncludeLocation(false);
                return;
            }
            const currentLocation = await Location.getCurrentPositionAsync({});
            setLocation({
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
            });
        } catch (error) {
            Alert.alert('Error', 'Could not fetch location');
        }
    };

    useEffect(() => {
        if (includeLocation) {
            requestLocation();
        } else {
            setLocation(null);
        }
    }, [includeLocation]);

    const addImages = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            selectionLimit: 0,
            allowsMultipleSelection: true,
        });

        if (!result.canceled && result.assets.length > 0) {
            const imageData = result.assets.map(image => {
                const uri = image.uri;
                const fileName = uri.split('/').pop() || 'photo.jpg';
                const fileType = image.mimeType || `image/${fileName.split('.').pop()}`;
                return { uri, type: fileType, name: fileName };
            });

            setSelectedImages(imageData);
        } else {
            alert('You did not select any image.');
        }
    };

    const handleSubmit = async () => {
        if (!postContent) {
            alert('Please add text.');
            return;
        }

        try {
            const locationData = includeLocation && location
                ? { latitude: location.latitude, longitude: location.longitude }
                : null;

            await addNewPost(postContent, selectedImages, locationData);
            alert('Post created!');
            setPostContent('');
            setSelectedImages([]);
            setIncludeLocation(false);
        } catch (error) {
            alert(`Failed to create post. ${error}`);
        }
    };

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Create a New Post</Text>

            <TextInput
                style={styles.input}
                placeholder="What's on your mind?"
                multiline
                value={postContent}
                onChangeText={setPostContent}
            />

            <TouchableOpacity style={styles.imageButton} onPress={addImages}>
                <Text style={styles.buttonText}>Select Images</Text>
            </TouchableOpacity>

            <FlatList
                data={selectedImages}
                horizontal
                renderItem={({ item }) => (
                    <Image source={{ uri: item.uri }} style={styles.imagePreview} />
                )}
                keyExtractor={(_, index) => index.toString()}
            />

            {/* Location Toggle */}
            <View style={styles.toggleRow}>
                <Text>Add Location</Text>
                <Switch
                    value={includeLocation}
                    onValueChange={setIncludeLocation}
                />
            </View>

            {includeLocation && location && (
                <Text style={styles.locationText}>
                    Location: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                </Text>
            )}

            <Button title="Post" onPress={handleSubmit} />
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    input: {
        height: 100,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        padding: 8,
        marginBottom: 16,
        textAlignVertical: 'top',
    },
    imageButton: {
        backgroundColor: '#007bff',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    imagePreview: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 8,
    },
    toggleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 12,
    },
    locationText: {
        textAlign: 'center',
        marginBottom: 12,
        color: '#555',
    },
});

export default PostCreationCard;
