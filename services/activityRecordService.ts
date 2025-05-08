import { drizzle } from "drizzle-orm/expo-sqlite";
import { activityRecords } from '@/db/schema';
import { inArray, notInArray, and, gte, lt } from 'drizzle-orm';
import { SyncStatus } from '@/types/sqlTypes';

export function ActivityRecordService(drizzleDb: ReturnType<typeof drizzle>) {
    return {
        async create(activityCode: number, duration: number) {
            return drizzleDb.insert(activityRecords).values({
                activityCode,
                duration,
                time: Date.now(),
                lastModified: Date.now(),
                syncStatus: SyncStatus.NEW,
            });
        },

        async getUnsynced() {
            return drizzleDb.select().from(activityRecords)
                .where(notInArray(activityRecords.syncStatus, [SyncStatus.SYNCED]));
        },

        async markAsSynced(ids: number[]) {
            return drizzleDb
                .update(activityRecords)
                .set({
                    syncStatus: SyncStatus.SYNCED, lastModified: Date.now()
                })
                .where(inArray(activityRecords.id, ids));
        },
        async getToday() {
            const now = new Date();
            const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

            const startTimestamp = Math.floor(startOfDay.getTime());
            const endTimestamp = Math.floor(endOfDay.getTime());

            return drizzleDb
                .select()
                .from(activityRecords)
                .where(
                    and(
                        gte(activityRecords.time, startTimestamp),
                        lt(activityRecords.time, endTimestamp)
                    )
                );
        },
    };
}
