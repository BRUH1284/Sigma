import { drizzle } from "drizzle-orm/expo-sqlite";
import { ActivityRecord, activityRecords, dataVersions } from '@/db/schema';
import { inArray, notInArray, and, gte, lt, eq, ne } from 'drizzle-orm';
import { DataResource, SyncStatus } from '@/types/sqlTypes';
import { api } from "@/api/api";
import { DataVersionService } from "./dataVersionService";
import * as Crypto from 'expo-crypto';
import { AxiosError, AxiosResponse } from "axios";

export function ActivityRecordService(drizzleDb: ReturnType<typeof drizzle>) {
    const dataVersionService = DataVersionService(drizzleDb);
    return {
        async create(identificator: number | string, duration: number, kcal: number) {
            let activityCode: number | null = null;
            let userActivityId: string | null = null;

            if (typeof identificator == 'string')
                userActivityId = identificator;
            else
                activityCode = identificator;

            return await drizzleDb.insert(activityRecords).values({
                id: Crypto.randomUUID(),
                activityCode,
                userActivityId,
                duration,
                kcal,
                time: Math.floor(Date.now() / 1000),
                syncStatus: SyncStatus.NEW,
            });
        },
        async uploadUnsynced() {
            const unsyncedRecords = await this.getUnsynced();

            const toPost: ActivityRecord[] = [];
            const toPut: ActivityRecord[] = [];
            const idsToDelete: string[] = [];

            for (const record of unsyncedRecords) {
                switch (record.syncStatus) {
                    case SyncStatus.NEW:
                        toPost.push(record);
                        break;
                    case SyncStatus.MODIFIED:
                        toPut.push(record);
                        break;
                    case SyncStatus.DELETED:
                        idsToDelete.push(record.id);
                        break;
                }
            };

            if (toPost.length > 0)
                try {
                    const data = toPost.map((record) => {
                        return {
                            'id': Crypto.randomUUID(),
                            'duration': record.duration,
                            'kcal': record.kcal,
                            'time': record.time,
                            'activityId': record.userActivityId,
                            'activityCode': record.activityCode
                        };
                    });

                    await api.post('/activity-records', data);
                } catch (e) {
                    console.log('Failed to post activity record:', e, (e as any).response);
                }

            if (toPut.length > 0)
                try {
                    throw new Error("put Not implemented yet");

                    const updateDtos = toPut.map((record) => ({
                        id: record.id,
                        duration: record.duration,
                        kcal: record.kcal,
                        time: record.time,
                    }));

                    for (const updateDto of updateDtos)
                        await api.put('/activity-records', updateDto);

                } catch (e) {
                    console.log('Failed to put activity record:', e);
                }

            if (idsToDelete.length > 0) {
                for (const id of idsToDelete) {

                    await api.delete(`/activity-records?id=${id}`)
                        .then(() => {
                            this.deleteById(id, true);
                        })
                        .catch((e: AxiosError) => {
                            if (e.response?.status === 404)
                                this.deleteById(id, true);
                            else
                                console.log('Failed to delete activity record:', e.response?.status || e.message);
                        });
                }
            }
        },

        async sync() {
            try {
                await this.uploadUnsynced();

                // Download
                const response = await api.get('/activity-records/last-update-time');

                const remoteLastUpdate = new Date(response.data).getTime() / 1000;

                const lastModified = await dataVersionService.getDataVersion(DataResource.ActivityRecords);

                if (lastModified < remoteLastUpdate) {

                    const response = await api.get('/activity-records');
                    const remoteActivityRecords = response.data;


                    // TODO: maybe error
                    const formattedActivityRecords: ActivityRecord[] = remoteActivityRecords.map((item: any) => ({
                        id: item.id,
                        activityCode: item.activityCode,
                        userActivityId: item.activityId,
                        duration: item.duration,
                        kcal: item.kcal,
                        time: new Date(item.time).getTime() / 1000,
                        syncStatus: SyncStatus.SYNCED
                    }));

                    // Drop old rows
                    await drizzleDb.delete(activityRecords);

                    console.log(`inserted ${formattedActivityRecords.length} new activity records`);

                    // Insert new records
                    await drizzleDb.insert(activityRecords).values(formattedActivityRecords);

                    // Update version table
                    await dataVersionService.upsertDataVersion(remoteLastUpdate, null, DataResource.ActivityRecords);
                }
                console.log('sync called');
            } catch (e) {
                console.log('Record sync failed:', e);
            }
        },

        async getUnsynced() {
            return await drizzleDb.select().from(activityRecords)
                .where(notInArray(activityRecords.syncStatus, [SyncStatus.SYNCED]));
        },

        async markAsSynced(ids: string[]) {
            return await drizzleDb
                .update(activityRecords)
                .set({
                    syncStatus: SyncStatus.SYNCED
                })
                .where(inArray(activityRecords.id, ids));
        },
        async getTodayLocal() {
            const now = new Date();

            const startOfDay = new Date(now);
            startOfDay.setHours(0, 0, 0, 0);
            const startTimestamp = Math.floor(startOfDay.getTime() / 1000);

            const endOfDay = new Date(now);
            endOfDay.setHours(23, 59, 59, 999);
            const endTimestamp = Math.floor(endOfDay.getTime() / 1000);

            return await drizzleDb
                .select()
                .from(activityRecords)
                .where(
                    and(
                        gte(activityRecords.time, startTimestamp),
                        lt(activityRecords.time, endTimestamp),
                        ne(activityRecords.syncStatus, SyncStatus.DELETED)
                    )
                );
        },
        async getById(id: string) {
            return await drizzleDb
                .select()
                .from(activityRecords)
                .where(eq(activityRecords.id, id))
        },
        async deleteById(id: string, force: boolean) {
            const record = (await this.getById(id))[0];

            if (record == null)
                return;

            console.log('delete sync status', record.syncStatus);

            if (record.syncStatus == SyncStatus.NEW || force) {
                console.log(`try to delete local: ${id}`);
                // Delete immediately if the record was never synced
                return await drizzleDb.delete(activityRecords)
                    .where(eq(activityRecords.id, id));
            } else {
                console.log(`try to delete remote: ${id}`);
                // Mark for deletion to sync later
                return await drizzleDb.update(activityRecords)
                    .set({ syncStatus: SyncStatus.DELETED })
                    .where(eq(activityRecords.id, id));
            }

        }
    };
}
