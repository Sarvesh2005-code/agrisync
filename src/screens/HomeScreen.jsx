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

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setRefreshing(true);
        try {
            const detected = await RegionDetectionEngine.detectRegion();
            setRegion(detected);

            // Load 48h insights (Mock crops for now, or fetch from DB)
            const DEMO_CROPS = [
                { name: 'wheat', sowingDate: '2023-11-01', stage: 'Early Stage' },
                { name: 'sugarcane', sowingDate: '2023-01-01', stage: 'Mature' }
            ];
            const generatedInsights = await Insight48hEngine.generateInsights(DEMO_CROPS);
            setAlerts(generatedInsights.slice(0, 3));

            // Load notifications
            const notifs = await NotificationEngine.getRecents();
            setNotifications(notifs);
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
                        <Ionicons name="notifications" size={24} color="#fff" />
                        <View style={styles.redDot} />
                    </TouchableOpacity>
                </View>
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
                            <Text style={styles.notifHeaderTitle}>Notifications</Text>
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
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        paddingTop: 50,
        paddingBottom: 40,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
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
        top: 5,
        right: 5,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ff1744',
        borderWidth: 1,
        borderColor: '#2e7d32',
    },
    greeting: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        marginBottom: 2,
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
