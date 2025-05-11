import { drizzle } from "drizzle-orm/expo-sqlite";
import { activities, dataVersions } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { DataResource } from '@/types/sqlTypes';
import { api } from "@/api/api";
import { DataVersionService } from "./dataVersionService";

export function ActivityService(drizzleDb: ReturnType<typeof drizzle>) {
    // const create = async (heading: string, code: number, description: string, met: number) => {
    //     return drizzleDb.insert(activities).values({
    //         heading,
    //         code,
    //         description,
    //         met
    //     });
    // };

    const dataVersionService = DataVersionService(drizzleDb);
    return {
        async sync() {
            try {
                const response = await api.get('/activity/last-update-time');

                const remoteLastUpdate = new Date(response.data).getTime() / 1000;

                const lastModified = await dataVersionService.getDataVersion(DataResource.Activities);

                if (lastModified < remoteLastUpdate) {
                    const activityResponse = await api.get('/activity');
                    const remoteActivities = activityResponse.data;

                    const formattedActivities = remoteActivities.map((item: any) => ({
                        heading: item.majorHeading,
                        code: item.code,
                        description: item.description,
                        met: item.metValue,
                    }));

                    // Drop old rows
                    await drizzleDb.delete(activities);

                    console.log(`inserted ${formattedActivities.length} new activities`);

                    // Insert new records
                    if (formattedActivities.length > 0)
                        await drizzleDb.insert(activities).values(formattedActivities);

                    // Update version table
                    await dataVersionService.upsertDataVersion(remoteLastUpdate, null, DataResource.Activities);
                }
            } catch (e) {
                console.log('Activity sync failed:', e);
            }
        },
        async getAllLocal() {
            return await drizzleDb.select().from(activities);
        },
        async getByCode(code: number) {
            return await drizzleDb.select().from(activities)
                .where(eq(activities.code, code))
                .limit(1);
        }
    };
}
