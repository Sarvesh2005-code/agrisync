import * as SQLite from 'expo-sqlite';
import { SCHEMA } from './schema';
import { DB_NAME } from '../utils/constants';
import { seedDatabase } from '../data/seedData';
import Logger from '../utils/logger';

let dbInstance = null;

export const getDB = async () => {
    if (dbInstance) return dbInstance;
    dbInstance = await SQLite.openDatabaseAsync(DB_NAME);
    return dbInstance;
};

export const initDB = async () => {
    try {
        const db = await getDB();

        // Enable WAL support
        await db.execAsync('PRAGMA journal_mode = WAL;');

        // Create tables
        for (const [tableName, query] of Object.entries(SCHEMA)) {
            Logger.debug(`Creating table: ${tableName}`);
            await db.execAsync(query);
        }

        await seedDatabase();

        Logger.info('Database initialized successfully');
        return true;
    } catch (error) {
        Logger.error(error, 'Database Initialization');
        return false;
    }
};

export const clearDB = async () => {
    try {
        const db = await getDB();
        // Logic to clear tables if needed
        Logger.warn('Clear DB not fully implemented');
    } catch (e) {
        Logger.error(e, 'Clear DB');
    }
}
