// Mock notification generator
const ALERTS = [
    { title: 'Rain Alert', body: 'Heavy rain expected in your area in 2 hours. Cover harvested crops.', type: 'weather', timestamp: 'Just now' },
    { title: 'Market Update', body: 'Wheat prices are up by 5% in Pune mandi.', type: 'market', timestamp: '10 min ago' },
    { title: 'Pest Warning', body: 'Locust swarm reported in neighboring district.', type: 'pest', timestamp: '1 hour ago' }
];

export const NotificationEngine = {
    getRecents: async () => {
        return ALERTS;
    },

    // Simulate background fetch
    checkForUpdates: async () => {
        // Random chance to get a new alert
        return Math.random() > 0.5 ? ALERTS[0] : null;
    }
};
