import { drizzle } from "drizzle-orm/expo-sqlite";
import { activities, dataVersions } from '@/db/schema';
import { inArray, notInArray, and, gte, lt, eq } from 'drizzle-orm';
import { DataResource, SyncStatus } from '@/types/sqlTypes';
import { api } from "@/api/api";

export function ActivityService(drizzleDb: ReturnType<typeof drizzle>) {
    const create = async (heading: string, code: number, description: string, met: number) => {
        return drizzleDb.insert(activities).values({
            heading,
            code,
            description,
            met
        });
    };

    return {
        async pull() {

        },

        async sync() {
            const result = await drizzleDb.select({
                lastModified: dataVersions.lastModified
            })
                .from(dataVersions)
                .where(eq(dataVersions.resource, DataResource.Activities))
                .limit(1);

            const lastModified = result[0]?.lastModified ?? 0; // default fallback

            try {
                const response = await api.get('activity/last-update-time');

                const remoteLastUpdate = new Date(response.data.date).getTime() / 1000;

                if (lastModified < remoteLastUpdate) {
                    const activityResponse = await api.get('activity');
                    const remoteActivities = activityResponse.data;

                    const formattedActivities = remoteActivities.map((item: any) => ({
                        heading: item.majorHeading,
                        code: item.code,
                        description: item.description,
                        met: item.metValue,
                    }));

                    // Drop old rows
                    await drizzleDb.delete(activities);

                    // Insert new records
                    await drizzleDb.insert(activities).values(formattedActivities);

                    // Update version table
                    await drizzleDb
                        .update(dataVersions)
                        .set({ lastModified: remoteLastUpdate })
                        .where(eq(dataVersions.resource, DataResource.Activities));
                }
            } catch (e) {
                console.error('Activity sync failed:', e);
            }
        },


    };
}
