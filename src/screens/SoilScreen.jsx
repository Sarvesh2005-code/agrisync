import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SoilEngine } from '../engines/soilEngine';
import { RegionDetectionEngine } from '../engines/regionDetectionEngine';

const SoilScreen = () => {
    const { t } = useTranslation();
    const [soilInfo, setSoilInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSoilData();
    }, []);

    const loadSoilData = async () => {
        setLoading(true);
        const region = await RegionDetectionEngine.detectRegion();
        // Defaulting to wheat for demo if no crop selected
        const info = SoilEngine.getSoilInfo(region, 'wheat');
        setSoilInfo(info);
        setLoading(false);
    };

    const renderSoilProperty = (label, value) => (
        <View style={styles.propertyRow}>
            <Text style={styles.propLabel}>{label}</Text>
            <Text style={styles.propValue}>{value}</Text>
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{t('nav.soil')}</Text>
            </View>

            <View style={styles.content}>
                {loading ? (
                    <Text style={styles.loading}>{t('common.loading')}</Text>
                ) : (
                    <>
                        <View style={styles.mainCard}>
                            <Text style={styles.soilTypeLabel}>Soil Type</Text>
                            <Text style={styles.soilType}>{soilInfo?.type}</Text>
                        </View>

                        <View style={styles.detailsCard}>
                            <Text style={styles.sectionTitle}>Properties</Text>
                            {renderSoilProperty('pH Level', soilInfo?.ph)}
                            {renderSoilProperty('Nitrogen (N)', soilInfo?.nitrogen)}
                            {renderSoilProperty('Phosphorus (P)', soilInfo?.phosphorus)}
                            {renderSoilProperty('Potassium (K)', soilInfo?.potassium)}
                            {renderSoilProperty('Moisture', soilInfo?.moisture)}
                        </View>

                        <View style={styles.tipCard}>
                            <Text style={styles.tipTitle}>💡 Soil Tip</Text>
                            <Text style={styles.tipText}>
                                Based on your {soilInfo?.type}, consider adding organic compost to improve water retention.
                            </Text>
                        </View>
                    </>
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
    header: {
        padding: 20,
        backgroundColor: '#fff',
        paddingTop: 50,
        elevation: 2,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    content: {
        padding: 20,
    },
    loading: {
        textAlign: 'center',
        marginTop: 50,
        color: '#666',
    },
    mainCard: {
        backgroundColor: '#795548', // Brown 500
        padding: 25,
        borderRadius: 15,
        marginBottom: 20,
        alignItems: 'center',
    },
    soilTypeLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
        marginBottom: 5,
    },
    soilType: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
    },
    detailsCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 15,
        elevation: 2,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    propertyRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    propLabel: {
        color: '#666',
        fontSize: 16,
    },
    propValue: {
        color: '#333',
        fontWeight: 'bold',
        fontSize: 16,
    },
    tipCard: {
        backgroundColor: '#fff3e0',
        padding: 15,
        borderRadius: 10,
        borderLeftWidth: 4,
        borderLeftColor: '#ff9800',
    },
    tipTitle: {
        fontWeight: 'bold',
        color: '#e65100',
        marginBottom: 5,
    },
    tipText: {
        color: '#5d4037',
        lineHeight: 20,
    }
});

export default SoilScreen;
