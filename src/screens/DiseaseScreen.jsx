import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';
import { DiseaseEngine } from '../engines/diseaseEngine';
import { Ionicons } from '@expo/vector-icons';

const DiseaseScreen = () => {
    const { t } = useTranslation();
    const [image, setImage] = useState(null);
    const [result, setResult] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            analyzeImage(result.assets[0].uri);
        }
    };

    const analyzeImage = async (uri) => {
        setAnalyzing(true);
        setResult(null);
        try {
            const detection = await DiseaseEngine.detectFromImage(uri);
            setResult(detection);
        } catch (e) {
            console.error(e);
        } finally {
            setAnalyzing(false);
        }
    };

    const reset = () => {
        setImage(null);
        setResult(null);
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{t('nav.disease')}</Text>
            </View>

            <View style={styles.content}>
                {!image ? (
                    <View style={styles.uploadCard}>
                        <Ionicons name="scan-circle-outline" size={80} color="#2e7d32" />
                        <Text style={styles.uploadTitle}>Check Crop Health</Text>
                        <Text style={styles.uploadDesc}>Take a photo or upload to detect diseases instantly (Offline).</Text>

                        <TouchableOpacity style={styles.button} onPress={pickImage}>
                            <Ionicons name="images-outline" size={24} color="#fff" style={{ marginRight: 10 }} />
                            <Text style={styles.buttonText}>{t('disease.upload_gallery')}</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.resultContainer}>
                        <Image source={{ uri: image }} style={styles.previewImage} />

                        {analyzing ? (
                            <View style={styles.analyzing}>
                                <ActivityIndicator size="large" color="#2e7d32" />
                                <Text style={styles.analyzingText}>{t('disease.analyzing')}</Text>
                            </View>
                        ) : result ? (
                            <View style={styles.resultCard}>
                                <View style={styles.resultHeader}>
                                    <Ionicons name="warning" size={30} color="#d32f2f" />
                                    <Text style={styles.diseaseName}>{result.diseaseName}</Text>
                                </View>

                                <View style={styles.confidenceBadge}>
                                    <Text style={styles.confidenceText}>{(result.confidence * 100).toFixed(0)}% Match</Text>
                                </View>

                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Symptoms</Text>
                                    {result.symptoms.map((s, i) => (
                                        <Text key={i} style={styles.bulletPoint}>• {s}</Text>
                                    ))}
                                </View>

                                <View style={[styles.section, styles.treatmentSection]}>
                                    <Text style={[styles.sectionTitle, { color: '#1b5e20' }]}>Treatment</Text>
                                    <Text style={styles.treatmentText}>{result.treatment}</Text>
                                </View>

                                <TouchableOpacity style={styles.resetButton} onPress={reset}>
                                    <Text style={styles.resetText}>Check Another</Text>
                                </TouchableOpacity>
                            </View>
                        ) : null}
                    </View>
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
    uploadCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        elevation: 3,
        marginTop: 20,
    },
    uploadTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 20,
        color: '#333',
    },
    uploadDesc: {
        textAlign: 'center',
        color: '#666',
        marginTop: 10,
        marginBottom: 30,
        lineHeight: 22,
    },
    button: {
        backgroundColor: '#2e7d32',
        flexDirection: 'row',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 12,
        alignItems: 'center',
        width: '100%',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    resultContainer: {
        alignItems: 'center',
    },
    previewImage: {
        width: '100%',
        height: 300,
        borderRadius: 15,
        marginBottom: 20,
    },
    analyzing: {
        alignItems: 'center',
        padding: 20,
    },
    analyzingText: {
        marginTop: 15,
        fontSize: 16,
        color: '#666',
    },
    resultCard: {
        backgroundColor: '#fff',
        width: '100%',
        borderRadius: 15,
        padding: 20,
        elevation: 4,
    },
    resultHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    diseaseName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#d32f2f',
        marginLeft: 10,
    },
    confidenceBadge: {
        backgroundColor: '#ffebee',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        marginBottom: 20,
    },
    confidenceText: {
        color: '#c62828',
        fontWeight: 'bold',
        fontSize: 12,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    bulletPoint: {
        fontSize: 15,
        color: '#555',
        marginBottom: 4,
    },
    treatmentSection: {
        backgroundColor: '#e8f5e9',
        padding: 15,
        borderRadius: 10,
    },
    treatmentText: {
        color: '#2e7d32',
        lineHeight: 22,
    },
    resetButton: {
        marginTop: 10,
        padding: 15,
        alignItems: 'center',
    },
    resetText: {
        color: '#666',
        fontWeight: 'bold',
    }
});

export default DiseaseScreen;
