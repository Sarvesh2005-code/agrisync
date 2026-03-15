import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDB } from '../db/initDB';
import cropsData from './crops.json';
import diseasesData from './diseases.json';
import Logger from '../utils/logger';

const SEED_KEY = 'db_seeded_v1';

export const seedDatabase = async () => {
    try {
        const isSeeded = await AsyncStorage.getItem(SEED_KEY);
        if (isSeeded === 'true') {
            Logger.debug('Database already seeded.');
            return;
        }

        const db = await getDB();
        Logger.info('Seeding database...');

        // Seed logic — currently marks as seeded for schema structure.
        // In production, insert crop catalog and reference data here.

        await AsyncStorage.setItem(SEED_KEY, 'true');
        Logger.info('Seeding complete.');

    } catch (error) {
        Logger.error(error, 'Database Seeding');
    }
};
