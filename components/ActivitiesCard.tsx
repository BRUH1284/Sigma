import { STYLES } from "@/constants/style";
import React, { useEffect, useState } from "react";
import { View, Text, Modal, Pressable, StyleSheet, FlatList, RefreshControl } from "react-native";
import IconButton from "./IconButton";
import TextField from "./TextField";
import { useActivity } from "@/hooks/useActivity";
import { Activity, ActivityRecord, UserActivity } from "@/db/schema";
import { COLORS } from "@/constants/theme";
import NumberInputField from "./NumberInputField";
import { useActivityRecord } from "@/hooks/useActivityRecord";
import { useUserActivity } from "@/hooks/useUserActivity";

type ActivityRecordData = {
    id: string,
    name: string,
    duration: number,
    kcal: number,
    onDelete: () => void
};

type ActivityData = {
    id: number,
    name: string,
    description: string,
    met: number,
    activityCode?: number,
    userActivityId?: string,
}

export default function ActivitiesCard() {
    const { createRecord, getTodayActivitiesLocal, deleteRecord, syncActivityRecords } = useActivityRecord();
    const { syncActivities, getAllActivities, getActivityByCode } = useActivity();
    const { syncUserActivities, getUserActivityById, getAllUserActivities } = useUserActivity();
    const [modalVisible, setModalVisible] = useState(false);
    const [activityRecordsData, setActivityRecordsData] = useState<ActivityRecordData[]>([]);
    const [selectedActivity, setSelectedActivity] = useState<ActivityData | null>(null);
    const [activities, setActivities] = useState<ActivityData[]>([]);
    const [search, setSearch] = useState("");
    const [minutes, setMinutes] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const syncRecords = async () => {
        setIsRefreshing(true);

        // Get activities
        await syncUserActivities();
        await syncActivities();

        const fetchedActivities = await getAllActivities();
        const fetchedUserActivities = await getAllUserActivities();

        const combinedActivities = [
            ...fetchedActivities,
            ...fetchedUserActivities
        ];

        const mappedActivities: ActivityData[] = combinedActivities.map((activity, index) => ({
            id: index + 1,
            name: activity.heading,
            description: activity.description,
            met: activity.met,
            activityCode: (activity as Activity).code,
            userActivityId: (activity as UserActivity).id,
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
                    name: description,
                    duration: record.duration,
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
        activity.description.toLowerCase().includes(search.toLowerCase())
    );

    const closeModal = () => {
        setModalVisible(false);
        setSelectedActivity(null);
        setSearch("");
    };

    const addRecord = async () => {
        if (minutes < 0)
            return;

        closeModal();

        const identificator = selectedActivity!.userActivityId ?? selectedActivity?.activityCode!;

        await createRecord(identificator, minutes, minutes * 100);
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

    return (
        <View style={STYLES.card}>
            <View style={{ gap: 16 }}>
                <View
                    style={[styles.inputRow, {
                        justifyContent: "space-between"
                    }]}
                >
                    <Text style={[STYLES.title, { lineHeight: 32 }]}>Activities</Text>
                    <IconButton icon={{ size: 32, name: 'add', library: 'MaterialIcons' }} onPress={() => setModalVisible(true)} />
                </View>
                <FlatList
                    data={activityRecordsData}
                    keyExtractor={(item) => item.id.toString()}
                    ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={syncRecords}
                        />
                    }
                    renderItem={({ item }) => (
                        <View style={styles.inputRow}>
                            <Text style={[STYLES.header, {
                                flex: 1
                            }]}>{item.name}</Text>
                            <View
                                style={{
                                    width: 1,
                                    backgroundColor: COLORS.lightGray,
                                    alignSelf: 'stretch',
                                }}
                            />
                            <View style={{
                                alignItems: 'center',
                                width: 64
                            }}>
                                <Text style={STYLES.header}>{item.duration}</Text>
                                <Text style={[STYLES.text, { color: COLORS.gray }]}>Minutes</Text>
                            </View>
                            <View style={{ alignItems: 'center', width: 64 }}>
                                <Text style={STYLES.header}>{item.kcal}</Text>
                                <Text style={[STYLES.text, { color: COLORS.gray }]}>Kcal</Text>
                            </View>
                            <IconButton
                                style={{
                                    backgroundColor: COLORS.danger,
                                    alignSelf: 'center',
                                }}
                                icon={{
                                    size: 32,
                                    name: 'delete',
                                    library: 'MaterialIcons',
                                }}
                                onPress={item.onDelete}
                            />
                        </View>
                    )}
                />
            </View>
            <Modal
                transparent
                visible={modalVisible}
                animationType="fade"
                onRequestClose={closeModal}
            >
                <Pressable style={STYLES.overlay} onPress={closeModal}>
                    {!selectedActivity && (<Pressable
                        style={STYLES.popup}
                        onPress={(e) => e.stopPropagation()}
                    >
                        <View style={styles.inputRow}>
                            <IconButton
                                style={{ backgroundColor: COLORS.surface }}
                                icon={{
                                    size: 24,
                                    name: 'arrow-back',
                                    library: 'MaterialIcons',
                                }}
                                onPress={closeModal}
                            />
                            <Text style={[
                                STYLES.header,
                                {
                                    textAlign: 'center',
                                    flex: 1
                                }]}>Add activity</Text>
                            <IconButton
                                icon={{
                                    size: 24,
                                    name: 'edit',
                                    library: 'MaterialIcons',
                                }}
                                onPress={closeModal}
                            />
                        </View>
                        <TextField
                            placeholder="Search"
                            icon={{ size: 24, name: 'search', library: 'MaterialIcons' }}
                            onChangeText={setSearch}
                            value={search}
                        />
                        <FlatList
                            data={filteredActivities}
                            keyExtractor={(item) => item.id.toString()}
                            style={{ width: '100%' }}
                            renderItem={({ item }) => (
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        paddingVertical: 8,
                                        gap: 8,
                                    }}
                                >
                                    <Text
                                        style={{
                                            flexShrink: 1,
                                            flexGrow: 1,
                                            flexBasis: 0,
                                        }}
                                    >
                                        {item.description}
                                    </Text>
                                    <Text style={[STYLES.text, { flexShrink: 0, textAlign: 'center' }]}>{`${item.met}\nkcal/h`}</Text>
                                    <IconButton
                                        style={{ alignSelf: 'center' }}
                                        icon={{ size: 24, name: 'add', library: 'MaterialIcons' }}
                                        onPress={() => {
                                            setSelectedActivity(item);
                                            setMinutes(0);
                                        }}
                                    />
                                </View>
                            )}
                        />
                    </Pressable>)}
                    {selectedActivity && (
                        <Pressable
                            style={STYLES.popup}
                            onPress={(e) => e.stopPropagation()}
                        >
                            <View style={[styles.inputRow, { position: 'relative' }]}>
                                <IconButton
                                    style={{ backgroundColor: COLORS.surface }}
                                    icon={{
                                        size: 24,
                                        name: 'arrow-back',
                                        library: 'MaterialIcons',
                                    }}
                                    onPress={() => { setSelectedActivity(null) }}
                                />
                                <Text style={[STYLES.header, styles.centeredText]} numberOfLines={2}>{selectedActivity.name}</Text>
                            </View>
                            <Text style={[STYLES.text, { width: '100%', textAlign: 'center' }]}>{selectedActivity.description}</Text>
                            <NumberInputField
                                value={minutes}
                                onChangeNumber={setMinutes}
                                placeholder="Minutes"
                                minWidth={96}
                            />
                            <View style={[styles.inputRow, { position: 'relative', justifyContent: 'flex-end' }]}>
                                <Text style={[STYLES.text, { fontSize: 16 }]}>{selectedActivity.met * minutes}{' kcal'}</Text>
                                <IconButton
                                    icon={{
                                        size: 32,
                                        name: 'done',
                                        library: 'MaterialIcons',
                                    }}
                                    onPress={addRecord}
                                />
                            </View>
                        </Pressable>
                    )}
                </Pressable>
            </Modal>
        </View >
    );
}

const styles = StyleSheet.create({
    modalContent: {
        backgroundColor: "white",
        padding: 16,
        borderRadius: 12,
        margin: 32,
        maxHeight: "80%",
        gap: 12,
    },
    list: {
        gap: 32
    },
    activityItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: "#eee",
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        gap: 8,
    },
    centeredText: {
        position: 'absolute',
        padding: 32,
        left: 0,
        right: 0,
        textAlign: 'center',
        zIndex: -1,
    }
});