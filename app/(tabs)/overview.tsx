import { STYLES } from '@/constants/style';
import { COLORS } from '@/constants/theme';
import { ActivityRecordProvider } from '@/context/ActivityRecordContext';
import { useActivityRecord } from '@/hooks/useActivityRecord';
import React, { useRef } from 'react';
import {
    View,
    Text,
    Animated,
    Dimensions,
    StyleSheet,
    Button,
    TouchableOpacity,
} from 'react-native';


const data = Array.from({ length: 10 }, (_, i) => ({ id: i.toString(), title: `Item ${i + 1}` }));

const SCREEN_WIDTH = Dimensions.get('window').width;
const ITEM_SIZE = SCREEN_WIDTH / 3;
const SIDE_PADDING = (SCREEN_WIDTH - ITEM_SIZE) / 2;

function OverviewContent() {
    const activityRecords = useActivityRecord();
    const addActivityRecord = async () => {
        activityRecords.createRecord(1, 30);

        console.log(`${(await activityRecords.getUnsyncedActivities())}`);
        console.log(`${(await activityRecords.getTodayActivities()).length}`);
    }


    const scrollX = useRef(new Animated.Value(0)).current;
    return (
        <ActivityRecordProvider>

            <View style={STYLES.container}>
                <Animated.FlatList
                    data={data}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: SIDE_PADDING }}
                    decelerationRate="fast"
                    snapToInterval={ITEM_SIZE}
                    snapToAlignment="start"
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                        { useNativeDriver: true }
                    )}
                    scrollEventThrottle={16}
                    renderItem={({ item, index }) => {
                        const inputRange = [
                            (index - 1) * ITEM_SIZE,
                            index * ITEM_SIZE,
                            (index + 1) * ITEM_SIZE,
                        ];

                        const scale = scrollX.interpolate({
                            inputRange,
                            outputRange: [0.8, 1, 0.8],
                            extrapolate: 'clamp',
                        });

                        return (
                            <View style={{ width: ITEM_SIZE, height: ITEM_SIZE }}>
                                <Animated.View style={[styles.itemContainer, { transform: [{ scale }] }]}>
                                    <Text style={styles.itemText}>{item.title}</Text>
                                </Animated.View>
                            </View>
                        );
                    }}
                />
                <View style={STYLES.card}>
                    <View style={{
                        flexDirection: 'row',
                        width: '100%',
                        justifyContent: 'space-between'
                    }}>
                        <Text style={STYLES.title}>Activities</Text>
                        <TouchableOpacity
                            style={{
                                height: 32,
                                aspectRatio: 1,
                                borderRadius: 32,
                                backgroundColor: COLORS.gray,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            onPress={addActivityRecord}
                        ></TouchableOpacity>

                    </View>
                </View>
                <Button title={'add activity'} onPress={addActivityRecord}></Button>
            </View>
        </ActivityRecordProvider>
    );
}

export default function Overview() {
    return (
        <ActivityRecordProvider>
            <OverviewContent />
        </ActivityRecordProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    itemContainer: {
        flex: 1,
        backgroundColor: '#2196F3',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        padding: 10, // allows inner content to adapt
    },
    itemText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
