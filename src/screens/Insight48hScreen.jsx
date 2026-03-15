import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Insight48hEngine } from '../engines/insight48hEngine';
import { Ionicons } from '@expo/vector-icons';
import Logger from '../utils/logger';

// Demo crops moved outside component to avoid re-creation on every render
const DEMO_CROPS = [
    { name: 'wheat', sowingDate: '2023-10-15', stage: 'Vegetative' },
    { name: 'rice', sowingDate: '2023-08-01', stage: 'Flowering' }
];

const Insight48hScreen = () => {
    const { t } = useTranslation();
    const [insights, setInsights] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadInsights();
    }, []);

    const loadInsights = useCallback(async () => {
        setRefreshing(true);
        try {
            const data = await Insight48hEngine.generateInsights(DEMO_CROPS);
            setInsights(data);
        } catch (e) {
            Logger.error(e, 'Insight48hScreen loadInsights');
        } finally {
            setRefreshing(false);
            setLoading(false);
        }
    }, []);

    const getSeverityColor = useCallback((severity) => {
        switch (severity) {
            case 'high': return '#d32f2f';
            case 'medium': return '#f57c00';
            default: return '#388e3c';
        }
    }, []);

    const getIcon = useCallback((type) => {
        switch (type) {
            case 'irrigation': return 'water';
            case 'pest': return 'bug';
            case 'fertilizer': return 'flask';
            case 'weather': return 'sunny';
            default: return 'notifications';
        }
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2e7d32" />
                <Text style={styles.loadingText}>Loading insights...</Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadInsights} />}
        >
            <View style={styles.header}>
                <Text style={styles.title}>{t('nav.insights')}</Text>
                <Text style={styles.subtitle}>Advice for next 48 hours</Text>
            </View>

            <View style={styles.timeline}>
                {insights.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="checkmark-circle" size={60} color="#4caf50" />
                        <Text style={styles.emptyTitle}>All Good! 🌾</Text>
                        <Text style={styles.emptyText}>No alerts for now. Everything looks good!</Text>
                    </View>
                ) : (
                    insights.map((item, index) => (
                        <View key={index} style={styles.card}>
                            <View style={[styles.priorityStrip, { backgroundColor: getSeverityColor(item.severity) }]} />
                            <View style={styles.cardContent}>
                                <View style={styles.cardHeader}>
                                    <View style={styles.typeTag}>
                                        <Ionicons name={getIcon(item.type)} size={16} color="#555" />
                                        <Text style={styles.typeText}>{item.cropName} • {item.type}</Text>
                                    </View>
                                    <Text style={styles.time}>Today</Text>
                                </View>
                                <Text style={styles.message}>{item.message}</Text>
                            </View>
                        </View>
                    ))
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    loadingText: {
        marginTop: 10,
        color: '#666',
        fontSize: 16,
    },
    header: {
        padding: 20,
        backgroundColor: '#fff',
        paddingTop: 50,
        elevation: 2,
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    subtitle: {
        color: '#666',
        marginTop: 5,
    },
    timeline: {
        padding: 15,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 15,
        flexDirection: 'row',
        overflow: 'hidden',
        elevation: 2,
    },
    priorityStrip: {
        width: 6,
        height: '100%',
    },
    cardContent: {
        flex: 1,
        padding: 15,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    typeTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    typeText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#555',
        marginLeft: 5,
        textTransform: 'capitalize',
    },
    time: {
        fontSize: 12,
        color: '#999',
    },
    message: {
        fontSize: 16,
        color: '#333',
        lineHeight: 22,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 15,
    },
    emptyText: {
        color: '#999',
        marginTop: 8,
        fontSize: 15,
    },
});

export default Insight48hScreen;
