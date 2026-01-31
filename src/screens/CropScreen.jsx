import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { CROPS } from '../utils/constants';
import { Ionicons } from '@expo/vector-icons';

const CropScreen = () => {
    const { t } = useTranslation();
    const [myCrops, setMyCrops] = useState([
        { id: '1', name: 'wheat', sowingDate: '2023-11-01', duration: 120 }
    ]);
    const [showAdd, setShowAdd] = useState(false);
    const [newCropName, setNewCropName] = useState('');

    const addCrop = () => {
        if (newCropName) {
            setMyCrops([...myCrops, {
                id: Date.now().toString(),
                name: newCropName,
                sowingDate: new Date().toISOString().split('T')[0],
                duration: 120 // Default mock duration
            }]);
            setNewCropName('');
            setShowAdd(false);
        }
    };

    const calculateProgress = (sowingDate, duration) => {
        const start = new Date(sowingDate);
        const now = new Date();
        const diffTime = Math.abs(now - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const progress = Math.min((diffDays / duration), 1);
        return { diffDays, progress };
    };

    const renderCropItem = ({ item }) => {
        const { diffDays, progress } = calculateProgress(item.sowingDate, item.duration);

        return (
            <View style={styles.cropCard}>
                <View style={styles.cardHeader}>
                    <View style={styles.iconContainer}>
                        <Text style={{ fontSize: 24 }}>🌱</Text>
                    </View>
                    <View style={styles.headerInfo}>
                        <Text style={styles.cropName}>{item.name}</Text>
                        <Text style={styles.cropDate}>Sown: {item.sowingDate}</Text>
                    </View>
                    <View style={styles.ageBadge}>
                        <Text style={styles.ageText}>Day {diffDays}</Text>
                    </View>
                </View>

                <View style={styles.timelineContainer}>
                    <View style={styles.timelineBar}>
                        <View style={[styles.timelineFill, { width: `${progress * 100}%` }]} />
                    </View>
                    <View style={styles.timelineLabels}>
                        <Text style={styles.labelStart}>Sowing</Text>
                        <Text style={styles.labelCurrent}>Vegetative</Text>
                        <Text style={styles.labelEnd}>Harvest</Text>
                    </View>
                </View>

                <View style={styles.statusRow}>
                    <View style={styles.statusItem}>
                        <Ionicons name="sunny" size={16} color="#fbc02d" />
                        <Text style={styles.statusText}>Healthy</Text>
                    </View>
                    <View style={styles.statusItem}>
                        <Ionicons name="water" size={16} color="#03a9f4" />
                        <Text style={styles.statusText}>Needs Water</Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{t('nav.crop')}</Text>
                <TouchableOpacity onPress={() => setShowAdd(!showAdd)} style={styles.addButton}>
                    <Ionicons name={showAdd ? "close" : "add"} size={30} color="#fff" />
                </TouchableOpacity>
            </View>

            {showAdd && (
                <View style={styles.addForm}>
                    <Text style={styles.label}>Select Crop:</Text>
                    <View style={styles.chipContainer}>
                        {CROPS.map(crop => (
                            <TouchableOpacity
                                key={crop}
                                style={[styles.chip, newCropName === crop && styles.chipSelected]}
                                onPress={() => setNewCropName(crop)}
                            >
                                <Text style={[styles.chipText, newCropName === crop && styles.chipTextSelected]}>
                                    {crop}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <TouchableOpacity style={styles.submitButton} onPress={addCrop}>
                        <Text style={styles.submitButtonText}>Start Crop Journey</Text>
                    </TouchableOpacity>
                </View>
            )}

            <FlatList
                data={myCrops}
                renderItem={renderCropItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No crops registered yet.</Text>
                        <Text style={styles.emptySubText}>Add your first crop to track its journey!</Text>
                    </View>
                }
            />
        </View>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 50,
        elevation: 2,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    addButton: {
        width: 45,
        height: 45,
        borderRadius: 25,
        backgroundColor: '#2e7d32',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
    },
    addForm: {
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    label: {
        fontSize: 16,
        marginBottom: 10,
        fontWeight: '600',
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    chip: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#e0e0e0',
        marginRight: 10,
        marginBottom: 10,
    },
    chipSelected: {
        backgroundColor: '#2e7d32',
    },
    chipText: {
        color: '#333',
    },
    chipTextSelected: {
        color: '#fff',
        fontWeight: 'bold',
    },
    submitButton: {
        backgroundColor: '#2e7d32',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    list: {
        padding: 15,
    },
    cropCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 15,
        marginBottom: 15,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    iconContainer: {
        width: 50,
        height: 50,
        backgroundColor: '#e8f5e9',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    headerInfo: {
        flex: 1,
    },
    cropName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        textTransform: 'capitalize',
    },
    cropDate: {
        color: '#888',
        fontSize: 12,
    },
    ageBadge: {
        backgroundColor: '#E3F2FD',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    ageText: {
        color: '#1565C0',
        fontWeight: 'bold',
        fontSize: 12,
    },
    timelineContainer: {
        marginBottom: 15,
    },
    timelineBar: {
        height: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 5,
    },
    timelineFill: {
        height: '100%',
        backgroundColor: '#43a047',
    },
    timelineLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    labelStart: { fontSize: 10, color: '#999' },
    labelCurrent: { fontSize: 12, color: '#2e7d32', fontWeight: 'bold' },
    labelEnd: { fontSize: 10, color: '#999' },
    statusRow: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#f5f5f5',
        paddingTop: 10,
    },
    statusItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
        backgroundColor: '#f9f9f9',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
    },
    statusText: {
        marginLeft: 5,
        fontSize: 12,
        color: '#555',
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#888',
    },
    emptySubText: {
        color: '#aaa',
        marginTop: 5,
    }
});

export default CropScreen;
