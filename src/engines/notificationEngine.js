// Mock notification generator
const MOCK_ALERTS = [
    { id: 1, title: 'Rain Alert', body: 'Heavy rain expected in your area in 2 hours. Cover harvested crops.', type: 'weather', timestamp: 'Just now', crop: 'all' },
    { id: 2, title: 'Market Update', body: 'Wheat prices are up by 5% in Pune mandi.', type: 'market', timestamp: '10 min ago', crop: 'wheat' },
    { id: 3, title: 'Pest Warning', body: 'Locust swarm reported in neighboring district.', type: 'pest', timestamp: '1 hour ago', crop: 'cotton' },
    { id: 4, title: 'Fertilizer Reminder', body: 'Time for 2nd dose of Urea for Sugarcane.', type: 'fertilizer', timestamp: '2 hours ago', crop: 'sugarcane' }
];

export const NotificationEngine = {
    /**
     * Get recent notifications filtered by user crops
     * @param {Array} userCrops - List of crop names registered by user
     */
    getRecents: async (userCrops = []) => {
        // Filter alerts: Keep 'all' or matches user's crops
        // If user has no crops (userCrops empty), show all or just generic
        const cropNames = userCrops.map(c => c.name.toLowerCase());

        const filtered = MOCK_ALERTS.filter(alert =>
            alert.crop === 'all' || cropNames.includes(alert.crop.toLowerCase())
        );

        return filtered;
    },

    getUnreadCount: async (userCrops = []) => {
        const recents = await NotificationEngine.getRecents(userCrops);
        return recents.length; // Simple count for now
    },

    // Simulate background fetch
    checkForUpdates: async () => {
        return Math.random() > 0.7 ? MOCK_ALERTS[0] : null;
    }
};
