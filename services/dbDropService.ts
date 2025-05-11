import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as FileSystem from 'expo-file-system';

const DATABASE_NAME = process.env.DATABASE_NAME || 'sigma';

export function DbDropService() {
    return {
        async dropDatabase() {
            const dbPath = `${FileSystem.documentDirectory}SQLite/${DATABASE_NAME}`;

            const fileExists = FileSystem.getInfoAsync(dbPath);
            if ((await fileExists).exists) {
                await FileSystem.deleteAsync(dbPath, { idempotent: true });
                console.log('Database deleted');
            } else {
                console.log('Database file does not exist');
            }
        },
        async clearTables(drizzleDb: ReturnType<typeof drizzle>) {
            try {
                type TableRow = { name: string };

                const tables = await drizzleDb.all<TableRow>(
                    sql`SELECT name FROM sqlite_master 
                        WHERE type = 'table' 
                        AND name NOT LIKE 'sqlite_%';` // keep sqlite internal tables, drop all user ones
                );

                // Check if sqlite_sequence exists
                const sequenceTableCheck = await drizzleDb.all<TableRow>(
                    sql`SELECT name FROM sqlite_master 
                        WHERE type='table' AND name='sqlite_sequence';`
                );

                const hasSequenceTable = sequenceTableCheck.length > 0;
                let sequenceTableNames: string[] = [];

                if (hasSequenceTable) {
                    const sequenceTables = await drizzleDb.all<TableRow>(
                        sql`SELECT name FROM sqlite_sequence;`
                    );
                    sequenceTableNames = sequenceTables.map(t => t.name);
                }

                for (const { name: tableName } of tables) {
                    // Clear table data
                    await drizzleDb.run(sql.raw(`DELETE FROM "${tableName}"`));

                    // Reset autoincrement counter only if it exists
                    if (sequenceTableNames.includes(tableName)) {
                        await drizzleDb.run(sql.raw(`DELETE FROM sqlite_sequence WHERE name = "${tableName}"`));
                    }
                }

                await drizzleDb.run(sql.raw(`VACUUM`));

                console.log('All tables dropped');
            } catch (e) {
                console.error('Failed to reset database:', e);
            }
        }
    };
}