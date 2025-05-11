import { drizzle } from "drizzle-orm/expo-sqlite";
import { dataVersions } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { DataResource } from '@/types/sqlTypes';

export function DataVersionService(drizzleDb: ReturnType<typeof drizzle>) {
    return {
        async upsertDataVersion(lastModified: number | null, checksum: string | null, resource: DataResource) {
            const existing = await drizzleDb
                .select()
                .from(dataVersions)
                .where(eq(dataVersions.resource, resource))
                .limit(1);

            if (existing.length > 0) {
                await drizzleDb
                    .update(dataVersions)
                    .set({
                        lastModified: lastModified,
                        checksum: checksum
                    })
                    .where(eq(dataVersions.resource, resource));
            } else {
                await drizzleDb.insert(dataVersions).values({
                    resource: resource,
                    lastModified: lastModified,
                    checksum: checksum
                });
            }
        },
        async getDataVersion(resource: DataResource) {
            const result = await drizzleDb.select({
                lastModified: dataVersions.lastModified
            })
                .from(dataVersions)
                .where(eq(dataVersions.resource, resource))
                .limit(1);

            return result[0]?.lastModified ?? 0; // Fallback
        },
        async getChecksum(resource: DataResource) {
            const result = await drizzleDb.select({
                checksum: dataVersions.checksum
            })
                .from(dataVersions)
                .where(eq(dataVersions.resource, resource))
                .limit(1);

            return result[0]?.checksum ?? null; // Fallback
        }
    };
}
