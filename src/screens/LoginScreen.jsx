import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '../utils/constants';

const LoginScreen = ({ onLoginSuccess }) => {
    const { t, i18n } = useTranslation();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [village, setVillage] = useState('');
    const [selectedLang, setSelectedLang] = useState(LANGUAGES.EN);

    const handleGetStarted = async () => {
        // Validation
        if (!name.trim()) {
            Alert.alert('Required', 'Please enter your name');
            return;
        }
        if (!phone.trim() || phone.length < 10) {
            Alert.alert('Invalid Phone', 'Please enter a valid 10-digit phone number');
            return;
        }

        try {
            const profile = {
                name: name.trim(),
                phone: phone.trim(),
                village: village.trim() || 'Not specified',
                language: selectedLang,
                createdAt: new Date().toISOString()
            };

            // Save profile
            await AsyncStorage.setItem('user-profile', JSON.stringify(profile));

            // Set language
            await i18n.changeLanguage(selectedLang);
            await AsyncStorage.setItem('user-language', selectedLang);

            // Trigger success callback
            if (onLoginSuccess) {
                onLoginSuccess();
            }
        } catch (e) {
            console.error('Login error:', e);
            Alert.alert('Error', 'Failed to save your information. Please try again.');
        }
    };

    const renderLanguageOption = (lang, label, flag) => (
        <TouchableOpacity
            key={lang}
            style={[styles.langOption, selectedLang === lang && styles.langSelected]}
            onPress={() => setSelectedLang(lang)}
        >
            <Text style={styles.flag}>{flag}</Text>
            <Text style={[styles.langText, selectedLang === lang && styles.langTextSelected]}>
                {label}
            </Text>
            {selectedLang === lang && <Ionicons name="checkmark-circle" size={20} color="#2e7d32" />}
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <View style={styles.iconCircle}>
                    <Ionicons name="leaf" size={48} color="#fff" />
                </View>
                <Text style={styles.appName}>AgriSync</Text>
                <Text style={styles.tagline}>Empowering Farmers with Smart Agriculture</Text>
            </View>

            <View style={styles.form}>
                <Text style={styles.welcomeText}>Welcome, Farmer! 🌾</Text>
                <Text style={styles.subtitle}>Let's get you started with AgriSync</Text>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Your Name *</Text>
                    <View style={styles.inputContainer}>
                        <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter your full name"
                            placeholderTextColor="#999"
                        />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Phone Number *</Text>
                    <View style={styles.inputContainer}>
                        <Ionicons name="call-outline" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="10-digit mobile number"
                            placeholderTextColor="#999"
                            keyboardType="phone-pad"
                            maxLength={10}
                        />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Village / District</Text>
                    <View style={styles.inputContainer}>
                        <Ionicons name="location-outline" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            value={village}
                            onChangeText={setVillage}
                            placeholder="Your location (optional)"
                            placeholderTextColor="#999"
                        />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Preferred Language</Text>
                    <View style={styles.langContainer}>
                        {renderLanguageOption(LANGUAGES.EN, 'English', '🇬🇧')}
                        {renderLanguageOption(LANGUAGES.HI, 'हिंदी', '🇮🇳')}
                        {renderLanguageOption(LANGUAGES.MR, 'मराठी', '🇮🇳')}
                    </View>
                </View>

                <TouchableOpacity style={styles.startButton} onPress={handleGetStarted}>
                    <Text style={styles.startButtonText}>Get Started</Text>
                    <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 10 }} />
                </TouchableOpacity>

                <Text style={styles.disclaimer}>
                    By continuing, you agree to use AgriSync for agricultural purposes.
                    Your data is stored locally on your device.
                </Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        flexGrow: 1,
    },
    header: {
        backgroundColor: '#2e7d32',
        paddingTop: 60,
        paddingBottom: 40,
        alignItems: 'center',
    },
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    appName: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    tagline: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        paddingHorizontal: 40,
    },
    form: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: -20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 25,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 30,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        paddingHorizontal: 15,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        paddingVertical: 15,
        fontSize: 16,
        color: '#333',
    },
    langContainer: {
        gap: 10,
    },
    langOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    langSelected: {
        backgroundColor: '#e8f5e9',
        borderColor: '#2e7d32',
    },
    flag: {
        fontSize: 24,
        marginRight: 12,
    },
    langText: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    langTextSelected: {
        fontWeight: 'bold',
        color: '#2e7d32',
    },
    startButton: {
        backgroundColor: '#2e7d32',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 18,
        borderRadius: 12,
        marginTop: 30,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    startButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    disclaimer: {
        fontSize: 12,
        color: '#999',
        textAlign: 'center',
        marginTop: 20,
        lineHeight: 18,
    }
});

export default LoginScreen;
