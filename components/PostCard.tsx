import { STYLES } from "@/constants/style";
import { COLORS } from "@/constants/theme";
import { UserPost } from "@/types/postTypes";
import { useState } from "react";
import { View, Image, Text, StyleSheet, Modal, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
    post: UserPost
};

const PostCard: React.FC<Props> = ({
    post
}) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    const allImages = [...post.imageUrls];

    let firstRow: string[] = [];
    let secondRow: string[] = [];

    if (allImages.length <= 3)
        firstRow = allImages;
    else if (allImages.length == 4) {
        firstRow = allImages.slice(0, 1);
        secondRow = allImages.slice(1);
    } else {
        firstRow = allImages.slice(0, 2);
        secondRow = allImages.slice(2);
    }

    const openImage = (index: number) => {
        setSelectedImageIndex(index);
        setImageLoading(true);
        setModalVisible(true);
    };

    const goToNextImage = () => {
        setImageLoading(true);
        setSelectedImageIndex(prevIndex =>
            prevIndex === allImages.length - 1 ? 0 : prevIndex + 1
        );
    };

    const goToPrevImage = () => {
        setImageLoading(true);
        setSelectedImageIndex(prevIndex =>
            prevIndex === 0 ? allImages.length - 1 : prevIndex - 1
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={{
                    flexDirection: 'row',
                    gap: 16,
                    alignItems: 'center',
                    flexShrink: 1
                }}>
                    <Image style={{
                        width: 32,
                        height: 32,
                        borderRadius: 32
                    }}
                        resizeMode='cover'
                        source={
                            post.author.profilePictureUrl
                                ? { uri: post.author.profilePictureUrl }
                                : require('@/assets/images/default-avatar.png')
                        } />
                    <Text style={[STYLES.text, {
                        flexShrink: 1,
                        flexWrap: 'wrap'
                    }]}>
                        {post.author.userName}
                    </Text>
                </View>

                <Text style={[STYLES.text,
                {
                    marginLeft: 'auto',
                    flexShrink: 0,
                    color: COLORS.onSurface
                }]}>
                    {new Date(post.createdAt).toLocaleString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    })}
                </Text>
            </View>
            <View style={{ gap: 2 }}>
                {firstRow.length > 0 && (
                    <View style={styles.imagesRow}>
                        {firstRow.map((url, index) => (
                            <TouchableOpacity
                                key={`first-${index}`}
                                style={[
                                    firstRow.length === 1
                                        ? styles.singleImage
                                        : styles.multipleImages
                                ]}
                                onPress={() => openImage(index)}
                            >
                                <Image
                                    source={{ uri: url }}
                                    style={styles.image}
                                    resizeMode='cover'
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
                {secondRow.length > 0 && (
                    <View style={styles.imagesRow}>
                        {secondRow.slice(0, 5).map((url, index) => (
                            <TouchableOpacity
                                key={`second-${index}`}
                                style={styles.multipleImages}
                                onPress={() => openImage(firstRow.length + index)}
                            >
                                <Image
                                    source={{ uri: url }}
                                    style={styles.image}
                                    resizeMode="cover"
                                />
                                {index === 4 && secondRow.length > 5 && (
                                    <View style={styles.remainingImagesOverlay}>
                                        <Text style={styles.remainingImagesText}>+{secondRow.length - 5}</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>
            <View style={styles.contentContainer}>
                <Text style={STYLES.text}>{post.content}</Text>
            </View>

            <Modal
                visible={modalVisible}
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalContainer}
                    activeOpacity={1}
                    onPress={() => setModalVisible(false)}
                >
                    {imageLoading && (
                        <ActivityIndicator
                            size="large"
                            color={COLORS.onSurface}
                            style={styles.loadingIndicator}
                        />
                    )}
                    <Image
                        source={{ uri: allImages[selectedImageIndex] }}
                        style={styles.fullImage}
                        resizeMode="contain"
                        onLoad={() => setImageLoading(false)}
                        onError={() => setImageLoading(false)}
                    />

                    <View style={styles.navigationContainer}>
                        <TouchableOpacity
                            style={styles.navButton}
                            onPress={(e) => {
                                e.stopPropagation();
                                goToPrevImage();
                            }}
                        >
                            <Ionicons name="chevron-back" size={32} color="white" />
                        </TouchableOpacity>

                        <View style={styles.counterContainer}>
                            <Text style={styles.counterText}>
                                {selectedImageIndex + 1} / {allImages.length}
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={styles.navButton}
                            onPress={(e) => {
                                e.stopPropagation();
                                goToNextImage();
                            }}
                        >
                            <Ionicons name="chevron-forward" size={32} color="white" />
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.surface,
        elevation: 4,
        borderRadius: 24,
        padding: 2
    },
    headerContainer: {
        margin: 8,
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    contentContainer: {
        padding: 14
    },
    imagesRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        columnGap: 2
    },
    image: {
        borderRadius: 4,
        height: '100%',
        width: '100%'
    },
    singleImage: {
        flexGrow: 1,
        maxHeight: 256,
        height: 1,
        aspectRatio: 16 / 9,
    },
    multipleImages: {
        flexGrow: 1,
        height: 1,
        aspectRatio: 1,
    },
    timestamp: {
        fontSize: 12,
        color: '#888',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    fullImage: {
        width: '100%',
        height: '100%',
    },
    navButton: {
        zIndex: 1,
    },
    imageCounter: {
        flexDirection: 'row',
        gap: 16,
        position: 'absolute',
        bottom: 64,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 20,
        zIndex: 1
    },
    counterText: {
        color: 'white',
        fontSize: 16,
        lineHeight: 32
    },
    remainingImagesOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    remainingImagesText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    loadingIndicator: {
        position: 'absolute',
        zIndex: 2,
    },
    counterContainer: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 5,
    },
    navigationContainer: {
        position: 'absolute',
        bottom: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingHorizontal: 20,
    },
});

export default PostCard;