import { SyncStatus } from '@/types/sqlTypes';
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const dataVersions = sqliteTable('data_versions', {
    resource: integer('data_resource').primaryKey({ autoIncrement: false }), // DataResource enum
    lastModified: integer('last_modified'),
    checksum: text('checksum')
});

export const activities = sqliteTable('activities', {
    heading: text('major_heading').notNull(),
    code: integer('id').primaryKey({ autoIncrement: false }),
    description: text('description').notNull(),
    met: real('met_value').notNull()
});

export const userActivities = sqliteTable('user_activities', {
    id: text('id').primaryKey(),
    heading: text('major_heading').notNull(),
    description: text('description').notNull(),
    met: real('met_value').notNull(),
    syncStatus: integer('sync_status')
        .notNull()
        .default(SyncStatus.NEW),
});

export const activityRecords = sqliteTable('activity_records', {
    id: text('id').primaryKey(),
    activityCode: integer('activity_code'),
    userActivityId: text('user_activity_id'),
    duration: real('duration_m')
        .notNull()
        .references(() => activities.code),
    kcal: real('kcal')
        .notNull(),
    time: integer('time').notNull(), // Unix timestamp
    syncStatus: integer('sync_status')
        .notNull()
        .default(SyncStatus.NEW),
});

export type DataVersions = typeof dataVersions.$inferSelect;
export type Activity = typeof activities.$inferSelect;
export type UserActivity = typeof userActivities.$inferSelect;
export type ActivityRecord = typeof activityRecords.$inferSelect;