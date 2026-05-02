/**
 * notificationEngine.js
 * 
 * Purpose: Manage farmer notifications and alerts
 * Features:
 * - Crop-specific and general notifications
 * - Weather alerts, pest warnings, fertilizer reminders
 * - Mark as read/dismiss functionality
 * - Persistent storage in AsyncStorage
 * - Unread count tracking
 * 
 * Storage Key: 'notifications_v1'
 * Data Format: Array of notification objects with id, title, body, type, crop, read, dismissed
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import Logger from '../utils/logger';

const STORAGE_KEY = 'notifications_v1';

/**
 * Mock notifications for initial app load
 * These are saved to AsyncStorage on first run
 */
const MOCK_ALERTS = [
    { id: '1', title: 'Rain Alert', body: 'Heavy rain expected in your area in 2 hours. Cover harvested crops.', type: 'weather', timestamp: 'Just now', crop: 'all', read: false },
    { id: '2', title: 'Start Sowing', body: 'Temperature is optimal for Wheat sowing today.', type: 'market', timestamp: '1 hour ago', crop: 'wheat', read: false },
    { id: '3', title: 'Pest Warning', body: 'Locust swarm reported in neighboring district.', type: 'pest', timestamp: 'Yesterday', crop: 'cotton', read: false },
    { id: '4', title: 'Fertilizer Reminder', body: 'Time for 2nd dose of Urea for Sugarcane.', type: 'fertilizer', timestamp: '2 days ago', crop: 'sugarcane', read: false }
];

export const NotificationEngine = {
    /**
     * Get active notifications (not dismissed)
     */
    getRecents: async (userCrops = []) => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            let all = stored ? JSON.parse(stored) : MOCK_ALERTS;

            // If first load, save mocks
            if (!stored) {
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_ALERTS));
            }

            const cropNames = userCrops.map(c => c.name.toLowerCase());

            // Filter: (Generic OR Matches Crop) AND (Not Dismissed)
            return all.filter(alert =>
                (alert.crop === 'all' || cropNames.includes(alert.crop.toLowerCase())) &&
                !alert.dismissed
            );
        } catch (e) {
            Logger.error(e, 'NotificationEngine getRecents');
            return [];
        }
    },

    getUnreadCount: async (userCrops = [], preFetchedRecents = null) => {
        // ⚡ Bolt Optimization: Use preFetchedRecents if available to avoid redundant AsyncStorage read
        const recents = preFetchedRecents || await NotificationEngine.getRecents(userCrops);
        return recents.filter(n => !n.read).length;
    },

    markAsRead: async (id) => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            let all = stored ? JSON.parse(stored) : [];
            const updated = all.map(n => n.id === id ? { ...n, read: true } : n);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch (e) {
            Logger.error(e, 'NotificationEngine markAsRead');
        }
    },

    dismiss: async (id) => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            let all = stored ? JSON.parse(stored) : [];
            const updated = all.map(n => n.id === id ? { ...n, dismissed: true } : n);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch (e) {
            Logger.error(e, 'NotificationEngine dismiss');
        }
    },

    triggerMockAlert: async (title, body, type, crop = 'all') => {
        try {
            const newAlert = {
                id: Date.now().toString(),
                title, body, type, crop,
                timestamp: 'Just now',
                read: false,
                dismissed: false
            };
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            let all = stored ? JSON.parse(stored) : [];
            all.unshift(newAlert);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(all));
            return newAlert;
        } catch (e) {
            Logger.error(e, 'NotificationEngine triggerMockAlert');
            return null;
        }
    }
};
