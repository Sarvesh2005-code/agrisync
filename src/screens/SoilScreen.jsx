import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SoilEngine } from '../engines/soilEngine';
import { RegionDetectionEngine } from '../engines/regionDetectionEngine';
import { Ionicons } from '@expo/vector-icons';

const SOIL_TYPES = [
    'Alluvial Soil',
    'Black Cotton Soil',
    'Red Soil',
    'Laterite Soil',
    'Mountain Soil',
    'Desert Soil'
];

const SoilScreen = () => {
    const { t } = useTranslation();
    const [soilInfo, setSoilInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);

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

    const changeSoilType = (newType) => {
        const newInfo = SoilEngine.getSoilDetails(newType);
        setSoilInfo(newInfo);
        setModalVisible(false);
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
                <TouchableOpacity style={styles.editButton} onPress={() => setModalVisible(true)}>
                    <Ionicons name="pencil" size={20} color="#2e7d32" />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                {loading ? (
                    <Text style={styles.loading}>{t('common.loading')}</Text>
                ) : (
                    <>
                        <View style={styles.mainCard}>
                            <Text style={styles.soilTypeLabel}>{t('soil.current')}</Text>
                            <Text style={styles.soilType}>{soilInfo?.type}</Text>
                            <TouchableOpacity style={styles.changeBtn} onPress={() => setModalVisible(true)}>
                                <Text style={styles.changeBtnText}>{t('soil.edit_type')}</Text>
                            </TouchableOpacity>
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

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{t('soil.select')}</Text>
                        <FlatList
                            data={SOIL_TYPES}
                            keyExtractor={item => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.modalItem} onPress={() => changeSoilType(item)}>
                                    <Text style={styles.modalItemText}>{item}</Text>
                                    {soilInfo?.type === item && <Ionicons name="checkmark" size={20} color="#2e7d32" />}
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.closeButtonText}>{t('common.cancel')}</Text>
                        </TouchableOpacity>
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
        backgroundColor: '#fff',
        paddingTop: 50,
        elevation: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    editButton: {
        padding: 10,
        backgroundColor: '#e8f5e9',
        borderRadius: 10,
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
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    changeBtn: {
        marginTop: 15,
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    changeBtnText: {
        color: '#fff',
        fontSize: 12,
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
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        maxHeight: 400,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    modalItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalItemText: {
        fontSize: 16,
        color: '#333',
    },
    closeButton: {
        marginTop: 20,
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
    },
    closeButtonText: {
        color: '#666',
        fontWeight: 'bold',
    }
});

export default SoilScreen;
