import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LANGUAGES } from '../utils/constants';

const SettingsScreen = () => {
    const { t, i18n } = useTranslation();

    const changeLanguage = async (lang) => {
        await i18n.changeLanguage(lang);
        await AsyncStorage.setItem('user-language', lang);
    };

    const renderSettingItem = (icon, title, value, onPress) => (
        <TouchableOpacity style={styles.item} onPress={onPress}>
            <View style={styles.itemLeft}>
                <View style={styles.iconBox}>
                    <Ionicons name={icon} size={22} color="#2e7d32" />
                </View>
                <Text style={styles.itemTitle}>{title}</Text>
            </View>
            <View style={styles.itemRight}>
                <Text style={styles.itemValue}>{value}</Text>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </View>
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{t('settings.title')}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionHeader}>General</Text>
                {renderSettingItem('person-outline', t('settings.profile'), 'Farmer', () => { })}
                {renderSettingItem('language-outline', t('settings.language'), i18n.language.toUpperCase(), () => {
                    Alert.alert('Select Language', 'Choose your preferred language', [
                        { text: 'English', onPress: () => changeLanguage(LANGUAGES.EN) },
                        { text: 'हिंदी', onPress: () => changeLanguage(LANGUAGES.HI) },
                        { text: 'मराठी', onPress: () => changeLanguage(LANGUAGES.MR) },
                        { text: 'Cancel', style: 'cancel' }
                    ]);
                })}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionHeader}>Data & Sync</Text>
                {renderSettingItem('cloud-offline-outline', t('settings.offline_mode'), 'Active', () => { })}
                {renderSettingItem('sync-outline', 'Last Synced', 'Just now', () => { })}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionHeader}>App Info</Text>
                {renderSettingItem('information-circle-outline', 'Version', '1.0.0', () => { })}
                {renderSettingItem('help-circle-outline', 'Help & Support', '', () => { })}
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>AgriSync for India 🇮🇳</Text>
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
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    section: {
        backgroundColor: '#fff',
        marginBottom: 20,
        paddingVertical: 10,
    },
    sectionHeader: {
        fontSize: 14,
        color: '#666',
        fontWeight: 'bold',
        marginLeft: 20,
        marginBottom: 10,
        textTransform: 'uppercase',
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#e8f5e9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    itemTitle: {
        fontSize: 16,
        color: '#333',
    },
    itemRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemValue: {
        fontSize: 14,
        color: '#888',
        marginRight: 10,
    },
    footer: {
        alignItems: 'center',
        padding: 20,
        marginBottom: 20,
    },
    footerText: {
        color: '#999',
    }
});

export default SettingsScreen;
