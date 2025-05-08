import { SyncStatus } from '@/types/sqlTypes';
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const dataVersions = sqliteTable('data_versions', {
    resource: integer('data_resource').primaryKey({ autoIncrement: false }), // DataResource enum
    lastModified: integer('last_modified').notNull()
});

export const activities = sqliteTable('activities', {
    heading: text('major_heading').notNull(),
    code: integer('id').primaryKey({ autoIncrement: false }),
    description: text('description').notNull(),
    met: real('met_value').notNull()
});

export const userActivities = sqliteTable('user_activities', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    heading: text('major_heading').notNull(),
    description: text('description').notNull(),
    met: real('met_value').notNull(),
    lastModified: integer('last_modified').notNull(), // Unix timestamp
    syncStatus: integer('sync_status')
        .notNull()
        .default(SyncStatus.NEW),
});

export const activityRecords = sqliteTable('activity_records', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    activityCode: integer('activity_code').notNull(),
    duration: integer('duration_m')
        .notNull()
        .references(() => activities.code),
    time: integer('time').notNull(), // Unix timestamp
    lastModified: integer('last_modified').notNull(), // Unix timestamp
    syncStatus: integer('sync_status')
        .notNull()
        .default(SyncStatus.NEW),
});

export type DataVersions = typeof dataVersions.$inferSelect;
export type Activity = typeof activities.$inferSelect;
export type UserActivity = typeof userActivities.$inferSelect;
export type ActivityRecord = typeof activityRecords.$inferSelect; 