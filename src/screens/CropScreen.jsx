import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { CROPS } from '../utils/constants';

const CropScreen = () => {
    const { t } = useTranslation();
    const [myCrops, setMyCrops] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [newCropName, setNewCropName] = useState('');

    const addCrop = () => {
        if (newCropName) {
            setMyCrops([...myCrops, {
                id: Date.now().toString(),
                name: newCropName,
                stage: 'Vegetative',
                sowingDate: new Date().toISOString().split('T')[0]
            }]);
            setNewCropName('');
            setShowAdd(false);
        }
    };

    const renderCropItem = ({ item }) => (
        <View style={styles.cropCard}>
            <View style={styles.iconContainer}>
                {/* Placeholder for crop icon */}
                <Text style={{ fontSize: 30 }}>🌱</Text>
            </View>
            <View style={styles.cropInfo}>
                <Text style={styles.cropName}>{item.name}</Text>
                <Text style={styles.cropDetail}>Sown: {item.sowingDate}</Text>
                <Text style={styles.cropDetail}>Stage: {item.stage}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{t('nav.crop')}</Text>
                <TouchableOpacity onPress={() => setShowAdd(!showAdd)} style={styles.addButton}>
                    <Text style={styles.addButtonText}>{showAdd ? '×' : '+'}</Text>
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
                        <Text style={styles.submitButtonText}>Register Crop</Text>
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
                        <Text style={styles.emptySubText}>Add your first crop to get started!</Text>
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
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#2e7d32',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
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
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
        elevation: 2,
    },
    iconContainer: {
        width: 60,
        height: 60,
        backgroundColor: '#e8f5e9',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    cropInfo: {
        justifyContent: 'center',
    },
    cropName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    cropDetail: {
        color: '#666',
        marginTop: 2,
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
