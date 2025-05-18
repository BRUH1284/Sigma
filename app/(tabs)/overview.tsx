import ActivityRowAdd from '@/components/ActivityRowAdd';
import ActivityRowSummary from '@/components/ActivityRowSummary';
import GoalCard from '@/components/GoalCard';
import IconButton from '@/components/IconButton';
import NumberPopup from '@/components/NumberPopup';
import SearchPopup from '@/components/SearchPopup';
import SummaryCard from '@/components/SummaryCard';
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
    Pressable,
    FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRecommendations } from '@/hooks/useRecomendations';
import CircularProgress from '@/components/CircularProgress';
import { useTheme } from '@react-navigation/native';
import { COLORS } from '@/constants/theme';

const SCREEN_WIDTH = Dimensions.get('window').width - 32;
const ITEM_SIZE = SCREEN_WIDTH / 3;
const SIDE_PADDING = (SCREEN_WIDTH - ITEM_SIZE) / 2;

const TOTAL_DAYS = 30;
const START_INDEX = TOTAL_DAYS / 2;

/**
 * Typ reprezentujúci existujúcu záznamovú aktivitu z dňa.
 */
type ActivityRecordData = {
    /** ID záznamu */
    id: string,
    /** Popis aktivity */
    text: string,
    /** Trvanie aktivity v minútach */
    minutes: number,
    /** Spálené kalórie */
    kcal: number,
    /** Callback pre zmazanie záznamu */
    onDelete: () => void
};

/**
 * Typ reprezentujúci aktivitu, ktorú je možné pridať.
 */
type AddActivityData = {
    id?: number,
    name: string,
    text: string,
    met: number,
    activityCode?: number,
    userActivityId?: string,
    onAdd?: () => void,
}

/**
 * Vnútorný komponent, ktorý zobrazuje prehľad používateľských cieľov, aktivity a denný pokrok.
 * Obsahuje logiku synchronizácie, filtrovania, výpočtov a zobrazovania záznamov.
 *
 * @returns React komponent s prehľadom aktivít a cieľov
 */
function OverviewContent() {
    const { createRecord, getDayActivitiesLocal, getTodayActivitiesLocal, deleteRecord, syncActivityRecords } = useActivityRecord();
    const { syncActivities, getAllActivities, getActivityByCode } = useActivity();
    const { syncUserActivities, getUserActivityById, getAllUserActivities } = useUserActivity();
    const [activityRecordsData, setActivityRecordsData] = useState<ActivityRecordData[]>([]);
    const [activityRecordsKcalSum, setActivityRecordsKcalSum] = useState<number>(0);
    const [selectedActivity, setSelectedActivity] = useState<AddActivityData | null>(null);
    const [activities, setActivities] = useState<AddActivityData[]>([]);
    const [monthProgress, setMonthProgress] = useState<number[]>([]);
    const [search, setSearch] = useState("");
    const [number, setNumber] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const { userData, setWeight, loadData } = useUserData();
    const [popup, setPopup] = useState<'none' | 'activity' | 'weight'>('none');
    const styles = useStyles();
    const { colors } = useTheme();

    const recommendations = useRecommendations();

    /**
   * Synchronizuje všetky dáta: používateľské aktivity, systémové aktivity, záznamy a progress.
   */
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
            met: activity.met,
            activityCode: (activity as Activity).code,
            userActivityId: (activity as UserActivity).id,
            onAdd: () => {
                setSelectedActivity({
                    name: activity.heading,
                    text: activity.description,
                    met: activity.met,
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
        let activityRecKcalSum = 0;
        const mappedActivityRecordsData: ActivityRecordData[] = await Promise.all(
            activityRecords.map(async (record) => {
                activityRecKcalSum += record.kcal;

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


        let i = 0;
        const mProgress: number[] = [];
        const targetProgress = recommendations.rmrCalculator(userData);
        for (i; i < TOTAL_DAYS; i++) {
            const startOfDay = getStartOfDayUnix(i, START_INDEX);
            const dateProgress = await getDateProgress(startOfDay) / targetProgress;

            mProgress.push(dateProgress);
        }

        setActivityRecordsKcalSum(activityRecKcalSum);
        setActivityRecordsData(mappedActivityRecordsData);


        setMonthProgress(mProgress);

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

    /**
   * Zatvorí aktuálne modálne okno.
   */
    const closeModal = () => {
        setPopup('none');
        setSelectedActivity(null);
        setSearch("");
        setNumber(0);
    };

    /**
   * Pridá nový záznam aktivity na základe aktuálne vybranej aktivity a počtu minút.
   */
    const addRecord = async () => {
        if (number < 0)
            return;

        closeModal();

        const identificator = selectedActivity!.userActivityId ?? selectedActivity?.activityCode!;

        await createRecord(identificator, number, recommendations.metCalculator(selectedActivity!.met, number, userData?.weight ?? 0));
        await syncRecords();

    };

    /**
   * Vymaže záznam podľa ID a obnoví stav.
   * @param id - ID záznamu na odstránenie
   */
    const onDeleteRecord = async (id: string) => {
        try {
            await deleteRecord(id);
            await syncRecords();
        } catch (e) {
            console.error(e);
        }
    };

    /**
   * Získa UNIX čas začiatku dňa, posunutého o určitý index.
   * @param index Index dňa (relatívny)
   * @param startIndex Počiatočný index
   * @returns UNIX timestamp začiatku dňa
   */
    function getStartOfDayUnix(index: number, startIndex: number) {
        const today = new Date();
        const offsetDays = index - startIndex;

        const shiftedDate = new Date(today);
        shiftedDate.setDate(today.getDate() + offsetDays);
        shiftedDate.setHours(0, 0, 0, 0); // Start of day

        return Math.floor(shiftedDate.getTime() / 1000);
    }

    /**
   * Získa počet spálených kalórií za deň podľa začiatku dňa.
   * @param startOfDay UNIX timestamp začiatku dňa
   * @returns Celkové kalórie za daný deň
   */
    const getDateProgress = async (startOfDay: number) => {
        const dayActivityRecords = await getDayActivitiesLocal(startOfDay);

        let kcalSum = 0;
        for (const activity of dayActivityRecords) {
            kcalSum += activity.kcal;
        }
        return kcalSum;
    }



    const scrollX = useRef(new Animated.Value(0)).current;
    const renderItem = ({ index }: any) => {
        const unixStartOfDay = getStartOfDayUnix(index, START_INDEX);
        const isoDate = new Date((unixStartOfDay + 86400) * 1000).toISOString().slice(0, 10);

        return (
            <Animated.View style={{
                width: ITEM_SIZE,
                alignItems: 'center'
            }}
            >
                <CircularProgress
                    size={ITEM_SIZE - 8}
                    strokeWidth={8}
                    rings={[
                        { color: COLORS.secondaryVariant, progress: monthProgress[index] },
                        // { color: 'blue', progress: 0.5 },
                        // { color: COLORS.success, progress: 0 }
                    ]}
                    icons={[
                        { color: monthProgress[index] >= 1 ? colors.text : COLORS.gray, name: 'local-fire-department', library: 'MaterialIcons' },
                        // { name: 'water', library: 'MaterialCommunityIcons' },
                        // { name: 'food-fork-drink', library: 'MaterialCommunityIcons' },
                    ]}
                />
                <Text style={[styles.text, { padding: 4 }]}>{isoDate}</Text>
            </Animated.View>
        );
    };


    return (
        <SafeAreaView style={[styles.container, { paddingVertical: 0 }]}>
            <View style={[styles.card, {
                height: ITEM_SIZE + 48,
                padding: 0,
                paddingVertical: 16,
                flexShrink: 0,
            }]}>
                <Animated.FlatList
                    data={Array.from({ length: TOTAL_DAYS })}
                    keyExtractor={(_, index) => index.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: SIDE_PADDING }}
                    decelerationRate="fast"
                    snapToInterval={0}
                    snapToAlignment="start"
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                        { useNativeDriver: false }
                    )}
                    scrollEventThrottle={16}
                    renderItem={renderItem}
                    windowSize={21}
                    maxToRenderPerBatch={10}
                    removeClippedSubviews={true}
                    initialScrollIndex={START_INDEX}
                    getItemLayout={(_, index) => ({
                        length: ITEM_SIZE,
                        offset: ITEM_SIZE * index,
                        index,
                    })}
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
                headerKcal={activityRecordsKcalSum}
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
                <Pressable style={styles.overlay} onPress={() => { }}>
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
                            acceptText={`${recommendations.metCalculator(selectedActivity.met, number, userData?.weight ?? 0)} kcal`}
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
                            onBack={closeModal}
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


/**
 * Wrapper komponent, ktorý poskytuje potrebné kontexty (Activity, UserData, UserActivity, Record).
 * Obaluje `OverviewContent`.
 *
 * @returns Základný React komponent obrazovky „Overview“
 */
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
