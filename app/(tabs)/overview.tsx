import ActivityRowAdd from '@/components/ActivityRowAdd';
import ActivityRowSummary from '@/components/ActivityRowSummary';
import GoalCard from '@/components/GoalCard';
import IconButton from '@/components/IconButton';
import NumberPopup from '@/components/NumberPopup';
import SearchPopup from '@/components/SearchPopup';
import SummaryCard from '@/components/SummaryCard';
// import { STYLES } from '@/constants/style';
// import { COLORS } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { useStyles } from '@/constants/style';
import { ActivityProvider } from '@/context/ActivityContext';
import { ActivityRecordProvider } from '@/context/ActivityRecordContext';
import { UserActivityProvider } from '@/context/UserActivityContext';
import { UserDataProvider } from '@/context/UserDataContext';
import { Activity, UserActivity } from '@/db/schema';
import { useActivity } from '@/hooks/useActivity';
import { useActivityRecord } from '@/hooks/useActivityRecord';
import { useUserActivity } from '@/hooks/useUserActivity';
import { useUserData } from '@/hooks/useUserData';
import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    Animated,
    Dimensions,
    Modal,
    Pressable
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRecommendations } from '@/hooks/useRecomendations';


const data = Array.from({ length: 10 }, (_, i) => ({ id: i.toString(), title: `Item ${i + 1}` }));

const SCREEN_WIDTH = Dimensions.get('window').width;
const ITEM_SIZE = SCREEN_WIDTH / 3;
const SIDE_PADDING = (SCREEN_WIDTH - ITEM_SIZE) / 2;

type ActivityRecordData = {
    id: string,
    text: string,
    minutes: number,
    kcal: number,
    onDelete: () => void
};

type AddActivityData = {
    id?: number,
    name: string,
    text: string,
    kcal: number,
    activityCode?: number,
    userActivityId?: string,
    onAdd?: () => void,
}

function OverviewContent() {
    const { createRecord, getTodayActivitiesLocal, deleteRecord, syncActivityRecords } = useActivityRecord();
    const { syncActivities, getAllActivities, getActivityByCode } = useActivity();
    const { syncUserActivities, getUserActivityById, getAllUserActivities } = useUserActivity();
    const [activityRecordsData, setActivityRecordsData] = useState<ActivityRecordData[]>([]);
    const [selectedActivity, setSelectedActivity] = useState<AddActivityData | null>(null);
    const [activities, setActivities] = useState<AddActivityData[]>([]);
    const [search, setSearch] = useState("");
    const [number, setNumber] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const { userData, setWeight, loadData } = useUserData();
    const [popup, setPopup] = useState<'none' | 'activity' | 'weight'>('none');
    const styles = useStyles();

    const recommendations = useRecommendations();

    const syncRecords = async () => {
        setIsRefreshing(true);

        loadData();

        // Get activities
        await syncUserActivities();
        await syncActivities();

        const fetchedActivities = await getAllActivities();
        const fetchedUserActivities = await getAllUserActivities();

        const combinedActivities = [
            ...fetchedActivities,
            ...fetchedUserActivities
        ];

        const mappedActivities: AddActivityData[] = combinedActivities.map((activity, index) => ({
            id: index + 1,
            name: activity.heading,
            text: activity.description,
            kcal: activity.met,
            activityCode: (activity as Activity).code,
            userActivityId: (activity as UserActivity).id,
            onAdd: () => {
                setSelectedActivity({
                    name: activity.heading,
                    text: activity.description,
                    kcal: activity.met,
                    activityCode: (activity as Activity).code,
                    userActivityId: (activity as UserActivity).id
                })
            }
        }));
        setActivities(mappedActivities);


        // Get records
        await syncActivityRecords();
        const activityRecords = await getTodayActivitiesLocal();

        console.log('loaded activities count:', activityRecords.length);
        const mappedActivityRecordsData: ActivityRecordData[] = await Promise.all(
            activityRecords.map(async (record) => {
                let description = '';


                if (record.activityCode != null)
                    description = (await getActivityByCode(record.activityCode)).description;
                else if (record.userActivityId != null)
                    description = (await getUserActivityById(record.userActivityId)).description;

                return {
                    id: record.id,
                    text: description,
                    minutes: record.duration,
                    kcal: record.kcal,
                    onDelete: () => onDeleteRecord(record.id)
                };
            })
        );

        setActivityRecordsData(mappedActivityRecordsData);

        setIsRefreshing(false);
    };

    // Startup sync
    useEffect(() => {
        (async () => {
            await syncRecords();
        })();
    }, []);

    const filteredActivities = activities.filter((activity) =>
        activity.text!.toLowerCase().includes(search.toLowerCase())
    );

    const closeModal = () => {
        setPopup('none');
        setSelectedActivity(null);
        setSearch("");
        setNumber(0);
    };

    const addRecord = async () => {
        if (number < 0)
            return;

        closeModal();

        const identificator = selectedActivity!.userActivityId ?? selectedActivity?.activityCode!;

        await createRecord(identificator, number, number * 100);
        await syncRecords();

    };

    const onDeleteRecord = async (id: string) => {
        try {
            await deleteRecord(id);
            await syncRecords();
        } catch (e) {
            console.error(e);
        }
    };

    const scrollX = useRef(new Animated.Value(0)).current;
    return (
        <SafeAreaView style={[styles.container, { paddingVertical: 0 }]}>
            <View style={{ height: ITEM_SIZE }}>
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
                                <Animated.View style={{
                                    flex: 1,
                                    backgroundColor: '#2196F3',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 10,
                                    padding: 10,
                                    transform: [{ scale }],
                                }}
                                >
                                    <Text style={{
                                        color: '#fff',
                                        fontSize: 18,
                                        fontWeight: 'bold',
                                    }}>{item.title}</Text>
                                </Animated.View>
                            </View>
                        );
                    }}
                />
            </View>
            <View style={{ flexDirection: 'row', width: '100%', height: 80, gap: 16 }}>
                <GoalCard
                    current='123 kcal'
                    goal='123321 kcal'
                    icon={{
                        name: 'food-fork-drink',
                        size: 48,
                        library: 'MaterialCommunityIcons',
                    }}
                />
                <GoalCard
                    current='123'
                    goal={`${recommendations.rmrCalculator(userData)} kcal`}
                    icon={{
                        name: 'local-fire-department',
                        size: 48,
                        library: 'MaterialIcons',
                    }}
                    onPress={() => { setPopup('activity') }}
                />
            </View>
            <View style={{ flexDirection: 'row', width: '100%', height: 80, gap: 16 }}>
                <GoalCard
                    current='123'
                    goal={`${recommendations.waterCalculator(userData)} l`}
                    icon={{
                        name: 'water',
                        size: 48,
                        library: 'MaterialCommunityIcons',
                    }}
                />
                <GoalCard
                    current={`${userData?.weight} kg`}
                    goal={`${userData?.targetWeight} kg`}
                    icon={{
                        name: 'weight',
                        size: 48,
                        library: 'MaterialCommunityIcons',
                    }}
                    onPress={() => { setPopup('weight') }}
                />
            </View>
            <SummaryCard
                headerText='Activities'
                headerKcal={123}
                onHeaderAddButton={() => { setPopup('activity') }}
                flatListComponent={ActivityRowSummary}
                flatListComponentProps={activityRecordsData}
                onRefresh={syncRecords}
                refreshing={isRefreshing}
            />
            <Modal
                transparent
                visible={popup !== 'none'}
                animationType="fade"
                onRequestClose={closeModal}
            >
                <Pressable style={styles.overlay} onPress={closeModal}>
                    {popup === 'activity' && !selectedActivity && (
                        <SearchPopup
                            headerText='Add'
                            onBack={closeModal}
                            headerRightElement={
                                <IconButton
                                    icon={{
                                        size: 24,
                                        name: 'edit',
                                        library: 'MaterialIcons',
                                    }}
                                    onPress={closeModal}
                                />}
                            onChangeText={setSearch}
                            textFieldValue={search}
                            flatListComponentProps={filteredActivities}
                            flatListComponent={ActivityRowAdd}
                        />
                    )}
                    {popup === 'activity' && selectedActivity && (
                        <NumberPopup
                            headerText={selectedActivity.name}
                            onBack={() => setSelectedActivity(null)}
                            acceptText={`${selectedActivity.kcal} kcal`}
                            onAccept={(addRecord)}
                            text={selectedActivity.text}
                            placeholder='Minutes'
                            onChangeNumber={setNumber}
                            value={number}
                            minWidth={96}
                        />
                    )}
                    {popup === 'weight' && (
                        <NumberPopup
                            headerText='Weight'
                            onBack={() => closeModal}
                            onAccept={() => {
                                setWeight(number);
                                closeModal();
                            }}
                            placeholder='Kg'
                            onChangeNumber={setNumber}
                            value={number}
                            minWidth={96}
                            minValue={-100000}
                        />
                    )}
                </Pressable>
            </Modal>
        </SafeAreaView>
    );
}

export default function Overview() {
    return (
        <ActivityRecordProvider>
            <ActivityProvider>
                <UserActivityProvider>
                    <UserDataProvider>

                        <OverviewContent />
                    </UserDataProvider>
                </UserActivityProvider>
            </ActivityProvider>
        </ActivityRecordProvider>
    );
}

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//     },
//     itemContainer: {
//         flex: 1,
//         backgroundColor: '#2196F3',
//         justifyContent: 'center',
//         alignItems: 'center',
//         borderRadius: 10,
//         padding: 10, // allows inner content to adapt
//     },
//     itemText: {
//         color: '#fff',
//         fontSize: 18,
//         fontWeight: 'bold',
//     }
// });
