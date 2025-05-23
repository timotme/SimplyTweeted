import { MONGODB_URI, DB_ENCRYPTION_KEY } from '$lib/server/env';
import { DatabaseClient } from 'shared-lib/backend';

// Create a lazy-loaded singleton pattern
let dbInstance: DatabaseClient | null = null;

export function getDbInstance(): DatabaseClient {
    if (!dbInstance) {
        dbInstance = DatabaseClient.getInstance(MONGODB_URI, DB_ENCRYPTION_KEY);
    }
    return dbInstance;
}

export const initializeDatabase = async (): Promise<DatabaseClient> => {
    const db = getDbInstance();
    await db.connect();
    return db;
};
