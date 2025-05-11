import { drizzle } from "drizzle-orm/expo-sqlite";
import { userActivities, UserActivity } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { DataResource } from '@/types/sqlTypes';
import { api } from "@/api/api";
import { DataVersionService } from "./dataVersionService";

export function UserActivityService(drizzleDb: ReturnType<typeof drizzle>) {
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
                const response = await api.get('/activity/my/checksum');

                const remoteChecksum: string = response.data.checksum;

                const localChecksum = await dataVersionService.getChecksum(DataResource.UserActivities);

                if (localChecksum !== remoteChecksum) {
                    const activityResponse = await api.get('/activity/my');
                    const remoteUserActivities = activityResponse.data;

                    const formattedUserActivities: UserActivity[] = remoteUserActivities.map((item: any) => ({
                        id: item.id,
                        heading: item.majorHeading,
                        met: item.metValue,
                        description: item.description,
                    }));

                    // Drop old rows
                    await drizzleDb.delete(userActivities);

                    console.log(`inserted ${formattedUserActivities.length} new user activities`);

                    // Insert new records
                    if (formattedUserActivities.length > 0)
                        await drizzleDb.insert(userActivities).values(formattedUserActivities);

                    // Update version table
                    await dataVersionService.upsertDataVersion(null, remoteChecksum, DataResource.UserActivities);
                }
            } catch (e) {
                console.log('Activity sync failed:', e);
            }
        },
        async getAllLocal() {
            return await drizzleDb.select().from(userActivities);
        },
        async getById(id: string) {
            return await drizzleDb.select().from(userActivities)
                .where(eq(userActivities.id, id))
                .limit(1);
        }
    };
}
