import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useTranslation } from 'react-i18next';
import { RegionDetectionEngine } from '../engines/regionDetectionEngine';
import { Insight48hEngine } from '../engines/insight48hEngine';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const [region, setRegion] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setRefreshing(true);
        const detected = await RegionDetectionEngine.detectRegion();
        setRegion(detected);

        // Load 48h insights (Mock crops for now, or fetch from DB)
        const DEMO_CROPS = [
            { name: 'wheat', sowingDate: '2023-11-01', stage: 'Early Stage' },
            { name: 'sugarcane', sowingDate: '2023-01-01', stage: 'Mature' }
        ];
        const generatedInsights = await Insight48hEngine.generateInsights(DEMO_CROPS);
        // Filter for high/medium severity only for home dash
        setAlerts(generatedInsights.slice(0, 3));
        setRefreshing(false);
    };

    const getSeverityIcon = (severity) => {
        return severity === 'high' ? 'alert-circle' : 'information-circle';
    };

    const getSeverityColor = (severity) => {
        return severity === 'high' ? '#d32f2f' : '#f57c00';
    };

    return (
        <ScrollView
            style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadData} />}
        >
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>{t('home.welcome')}</Text>
                    <Text style={styles.location}>
                        {region ? `${region.district}, ${region.state}` : 'Locating...'}
                    </Text>
                </View>
            </View>

            {/* Weather Card (Mock) */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>{t('home.weather')}</Text>
                <View style={styles.weatherRow}>
                    <Text style={styles.temp}>28°C</Text>
                    <Text style={styles.desc}>Sunny</Text>
                </View>
                <View style={styles.weatherDetails}>
                    <Text>Humidity: 65%</Text>
                    <Text>Rain: 0mm</Text>
                </View>
            </View>

            {/* Alerts Section */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{t('home.alerts_title')}</Text>
                <TouchableOpacity onPress={() => navigation.navigate('48h')}>
                    <Text style={styles.viewAll}>{t('home.view_all')}</Text>
                </TouchableOpacity>
            </View>

            {alerts.length > 0 ? (
                alerts.map((alert, index) => (
                    <TouchableOpacity key={index} style={styles.alertCard} onPress={() => navigation.navigate('48h')}>
                        <View style={[styles.alertStripe, { backgroundColor: getSeverityColor(alert.severity) }]} />
                        <View style={styles.alertContent}>
                            <View style={styles.alertHeader}>
                                <Ionicons name={getSeverityIcon(alert.severity)} size={18} color={getSeverityColor(alert.severity)} />
                                <Text style={[styles.alertType, { color: getSeverityColor(alert.severity) }]}>
                                    {alert.cropName} • {alert.type}
                                </Text>
                            </View>
                            <Text numberOfLines={2} style={styles.alertMsg}>{alert.message}</Text>
                        </View>
                    </TouchableOpacity>
                ))
            ) : (
                <View style={styles.emptyAlert}>
                    <Ionicons name="checkmark-circle-outline" size={40} color="#388e3c" />
                    <Text style={styles.emptyAlertText}>{t('home.no_alerts')}</Text>
                </View>
            )}

            <View style={{ height: 20 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        padding: 20,
        backgroundColor: '#2e7d32', // Green 800
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        paddingTop: 60,
    },
    greeting: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 16,
        marginBottom: 4,
    },
    location: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
    },
    card: {
        backgroundColor: 'white',
        marginHorizontal: 15,
        marginTop: -30, // Overlap effect
        padding: 20,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
        marginBottom: 20,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#666',
        textTransform: 'uppercase',
    },
    weatherRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 10,
    },
    temp: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#2b2b2b',
        marginRight: 10,
    },
    desc: {
        fontSize: 18,
        color: '#666',
        fontWeight: '500',
    },
    weatherDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 15,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    viewAll: {
        color: '#2e7d32',
        fontWeight: '600',
    },
    alertCard: {
        backgroundColor: '#fff',
        marginHorizontal: 15,
        marginBottom: 10,
        borderRadius: 10,
        flexDirection: 'row',
        overflow: 'hidden',
        elevation: 2,
    },
    alertStripe: {
        width: 5,
        height: '100%',
    },
    alertContent: {
        padding: 15,
        flex: 1,
    },
    alertHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    alertType: {
        fontWeight: 'bold',
        fontSize: 12,
        marginLeft: 5,
        textTransform: 'uppercase',
    },
    alertMsg: {
        color: '#333',
        fontSize: 15,
        lineHeight: 20,
    },
    emptyAlert: {
        backgroundColor: '#fff',
        marginHorizontal: 15,
        padding: 30,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#ccc',
    },
    emptyAlertText: {
        marginTop: 10,
        color: '#666',
        fontSize: 16,
    }
});

export default HomeScreen;
