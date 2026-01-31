import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { RegionDetectionEngine } from '../engines/regionDetectionEngine';

const HomeScreen = () => {
    const { t } = useTranslation();
    const [region, setRegion] = useState(null);

    useEffect(() => {
        loadRegion();
    }, []);

    const loadRegion = async () => {
        const detected = await RegionDetectionEngine.detectRegion();
        setRegion(detected);
    };

    return (
        <ScrollView style={styles.container}>
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

            {/* Quick Actions */}
            <View style={styles.actions}>
                {/* Placeholder for actions */}
            </View>

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
        backgroundColor: '#2e7d32',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        paddingTop: 60, // Add top padding for status bar area usually
    },
    greeting: {
        color: '#fff',
        fontSize: 18,
        opacity: 0.9,
    },
    location: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
    },
    card: {
        backgroundColor: 'white',
        margin: 15,
        padding: 20,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    weatherRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 10,
    },
    temp: {
        fontSize: 42,
        fontWeight: 'bold',
        color: '#2b2b2b',
        marginRight: 10,
    },
    desc: {
        fontSize: 18,
        color: '#666',
    },
    weatherDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 10,
    },
});

export default HomeScreen;
