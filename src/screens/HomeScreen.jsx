import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Modal, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { RegionDetectionEngine } from '../engines/regionDetectionEngine';
import { Insight48hEngine } from '../engines/insight48hEngine';
import { NotificationEngine } from '../engines/notificationEngine';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const [region, setRegion] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [notifVisible, setNotifVisible] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Mock User Crops (In production, fetch from DB)
    const DEMO_CROPS = [
        { name: 'wheat', sowingDate: '2023-11-01', stage: 'Early Stage' },
        { name: 'sugarcane', sowingDate: '2023-01-01', stage: 'Mature' }
    ];

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setRefreshing(true);
        try {
            const detected = await RegionDetectionEngine.detectRegion();
            setRegion(detected);

            // Load 48h insights
            const generatedInsights = await Insight48hEngine.generateInsights(DEMO_CROPS);
            setAlerts(generatedInsights.slice(0, 3));

            // Load user-specific notifications
            const notifs = await NotificationEngine.getRecents(DEMO_CROPS);
            setNotifications(notifs);
            setUnreadCount(notifs.length);

        } catch (e) {
            console.error(e);
        } finally {
            setRefreshing(false);
        }
    };

    const getSeverityIcon = (severity) => {
        return severity === 'high' ? 'alert-circle' : 'information-circle';
    };

    const getSeverityColor = (severity) => {
        return severity === 'high' ? '#d32f2f' : '#f57c00';
    };

    const renderQuickAction = (icon, label, route) => (
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate(route)}>
            <View style={styles.actionIconBox}>
                <Ionicons name={icon} size={24} color="#2e7d32" />
            </View>
            <Text style={styles.actionLabel}>{label}</Text>
        </TouchableOpacity>
    );

    const renderNotificationItem = ({ item }) => (
        <View style={styles.notifItem}>
            <View style={[styles.notifIcon, { backgroundColor: item.type === 'weather' ? '#e3f2fd' : '#fff3e0' }]}>
                <Ionicons
                    name={item.type === 'weather' ? 'rainy' : item.type === 'market' ? 'trending-up' : 'warning'}
                    size={20}
                    color={item.type === 'weather' ? '#1976d2' : '#e65100'}
                />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={styles.notifTitle}>{item.title}</Text>
                <Text style={styles.notifBody}>{item.body}</Text>
                <Text style={styles.notifTime}>{item.timestamp}</Text>
            </View>
        </View>
    );

    return (
        <ScrollView
            style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadData} />}
        >
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <View style={styles.branding}>
                        <Text style={styles.appName}>AgriSync</Text>
                        <View style={styles.badge}><Text style={styles.badgeText}>BETA</Text></View>
                    </View>
                    <TouchableOpacity onPress={() => setNotifVisible(true)} style={styles.bellBtn}>
                        <Ionicons name="notifications" size={26} color="#fff" />
                        {unreadCount > 0 && (
                            <View style={styles.redDot}>
                                <Text style={styles.dotText}>{unreadCount}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
                <View>
                    <Text style={styles.greeting}>{t('home.welcome')}</Text>
                    <Text style={styles.location}>
                        {region ? `${region.district}, ${region.state}` : 'Locating...'}
                    </Text>
                </View>
            </View>

            {/* Weather Card */}
            <View style={styles.card}>
                <View style={styles.weatherHeader}>
                    <Text style={styles.cardTitle}>{t('home.weather')}</Text>
                    <Ionicons name="sunny" size={24} color="#fbc02d" />
                </View>
                <View style={styles.weatherRow}>
                    <Text style={styles.temp}>28°C</Text>
                    <View>
                        <Text style={styles.desc}>Sunny</Text>
                        <Text style={styles.feelsLike}>Feels like 30°C</Text>
                    </View>
                </View>
                <View style={styles.weatherDetails}>
                    <Text style={styles.weatherDetailText}><Ionicons name="water-outline" /> 65% Humidity</Text>
                    <Text style={styles.weatherDetailText}><Ionicons name="umbrella-outline" /> 0mm Rain</Text>
                </View>
            </View>

            {/* Quick Actions Grid */}
            <View style={styles.actionsGrid}>
                {renderQuickAction('leaf-outline', t('nav.crop'), 'Crop')}
                {renderQuickAction('medkit-outline', t('nav.disease'), 'Home')}
                {renderQuickAction('layers-outline', t('nav.soil'), 'Soil')}
                {renderQuickAction('newspaper-outline', 'Tips', '48h')}
            </View>

            {/* Daily Tip */}
            <View style={styles.tipCard}>
                <View style={styles.tipHeader}>
                    <Ionicons name="bulb" size={20} color="#fff" />
                    <Text style={styles.tipTitle}>Daily Tip</Text>
                </View>
                <Text style={styles.tipContent}>
                    Water your crops early in the morning to minimize evaporation and ensure better absorption.
                </Text>
            </View>
            {/* Alerts Section (Existing) */}
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

            {/* Notifications Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={notifVisible}
                onRequestClose={() => setNotifVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.notifModal}>
                        <View style={styles.notifHeader}>
                            <Text style={styles.notifHeaderTitle}>Notifications ({unreadCount})</Text>
                            <TouchableOpacity onPress={() => setNotifVisible(false)}>
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={notifications}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={renderNotificationItem}
                            ListEmptyComponent={<Text style={styles.noNotifs}>No new notifications</Text>}
                        />
                    </View>
                </View>
            </Modal>
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
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        paddingTop: 50,
        paddingBottom: 50,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    branding: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    appName: {
        color: '#fff',
        fontSize: 28,
        fontWeight: '900',
        letterSpacing: 1,
    },
    badge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginLeft: 8,
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    bellBtn: {
        position: 'relative',
        padding: 5,
    },
    redDot: {
        position: 'absolute',
        top: -2,
        right: -2,
        minWidth: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: '#ff1744',
        borderWidth: 1.5,
        borderColor: '#2e7d32',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dotText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    greeting: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 15,
        marginBottom: 2,
    },
    location: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
    },
    card: {
        backgroundColor: 'white',
        marginHorizontal: 20,
        marginTop: -40,
        padding: 20,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        marginBottom: 20,
    },
    weatherHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555',
        textTransform: 'uppercase',
    },
    weatherRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    temp: {
        fontSize: 52,
        fontWeight: 'bold',
        color: '#2e7d32',
        marginRight: 15,
    },
    desc: {
        fontSize: 20,
        color: '#333',
        fontWeight: '600',
    },
    feelsLike: {
        color: '#888',
        fontSize: 14,
    },
    weatherDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 15,
    },
    weatherDetailText: {
        color: '#555',
        fontWeight: '500',
    },
    actionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    actionBtn: {
        width: '23%',
        alignItems: 'center',
    },
    actionIconBox: {
        width: 60,
        height: 60,
        backgroundColor: '#fff',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
    },
    actionLabel: {
        fontSize: 12,
        color: '#555',
        fontWeight: '600',
        textAlign: 'center',
    },
    tipCard: {
        backgroundColor: '#2e7d32',
        marginHorizontal: 20,
        borderRadius: 15,
        padding: 20,
        marginBottom: 25,
        overflow: 'hidden',
    },
    tipHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    tipTitle: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 10,
    },
    tipContent: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 15,
        lineHeight: 22,
        fontStyle: 'italic',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 15,
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
        marginHorizontal: 20,
        marginBottom: 12,
        borderRadius: 12,
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
        lineHeight: 22,
    },
    emptyAlert: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        padding: 30,
        borderRadius: 12,
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
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    notifModal: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: '70%',
        padding: 20,
    },
    notifHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 15,
    },
    notifHeaderTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    notifItem: {
        flexDirection: 'row',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    notifIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    notifTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#333',
        marginBottom: 4,
    },
    notifBody: {
        color: '#666',
        fontSize: 14,
        lineHeight: 20,
    },
    notifTime: {
        color: '#999',
        fontSize: 12,
        marginTop: 5,
    },
    noNotifs: {
        textAlign: 'center',
        marginTop: 50,
        color: '#999',
    }
});

export default HomeScreen;
