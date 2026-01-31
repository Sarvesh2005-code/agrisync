import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Modal, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LANGUAGES } from '../utils/constants';

const SettingsScreen = () => {
    const { t, i18n } = useTranslation();
    const [user, setUser] = useState({ name: 'Guest Farmer', phone: '' });
    const [modalVisible, setModalVisible] = useState(false);
    const [tempName, setTempName] = useState('');
    const [tempPhone, setTempPhone] = useState('');

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const stored = await AsyncStorage.getItem('user-profile');
            if (stored) {
                setUser(JSON.parse(stored));
            }
        } catch (e) { console.error(e); }
    };

    const saveProfile = async () => {
        const newProfile = { name: tempName || user.name, phone: tempPhone || user.phone };
        await AsyncStorage.setItem('user-profile', JSON.stringify(newProfile));
        setUser(newProfile);
        setModalVisible(false);
    };

    const changeLanguage = async (lang) => {
        await i18n.changeLanguage(lang);
        await AsyncStorage.setItem('user-language', lang);
    };

    const renderSettingItem = (icon, title, value, onPress, isAction = false) => (
        <TouchableOpacity style={styles.item} onPress={onPress}>
            <View style={styles.itemLeft}>
                <View style={[styles.iconBox, isAction && styles.actionIcon]}>
                    <Ionicons name={icon} size={22} color={isAction ? "#d32f2f" : "#2e7d32"} />
                </View>
                <Text style={[styles.itemTitle, isAction && { color: '#d32f2f' }]}>{title}</Text>
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

            {/* Profile Card */}
            <View style={styles.profileCard}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
                </View>
                <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>{user.name}</Text>
                    <Text style={styles.profileSub}>{user.phone || 'No phone linked'}</Text>
                </View>
                <TouchableOpacity style={styles.editBtn} onPress={() => {
                    setTempName(user.name);
                    setTempPhone(user.phone);
                    setModalVisible(true);
                }}>
                    <Ionicons name="pencil" size={20} color="#2e7d32" />
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionHeader}>General</Text>
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
                {renderSettingItem('cloud-offline-outline', t('settings.offline_mode'), 'Always On', () => { })}
                {renderSettingItem('sync-outline', 'Sync Status', 'Up to date', () => { })}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionHeader}>Account</Text>
                {renderSettingItem('log-out-outline', 'Log Out', '', () => {
                    Alert.alert('Log Out', 'Are you sure?', [
                        { text: 'Cancel', style: 'cancel' },
                        {
                            text: 'Log Out', style: 'destructive', onPress: () => {
                                AsyncStorage.removeItem('user-profile');
                                setUser({ name: 'Guest Farmer', phone: '' });
                            }
                        }
                    ]);
                }, true)}
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>AgriSync v1.1.0</Text>
                <Text style={styles.footerText}>Made for Farmers 🌾</Text>
            </View>

            {/* Edit Profile Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Edit Profile</Text>

                        <Text style={styles.inputLabel}>Name</Text>
                        <TextInput
                            style={styles.input}
                            value={tempName}
                            onChangeText={setTempName}
                            placeholder="Enter Name"
                        />

                        <Text style={styles.inputLabel}>Phone</Text>
                        <TextInput
                            style={styles.input}
                            value={tempPhone}
                            onChangeText={setTempPhone}
                            placeholder="Enter Phone Number"
                            keyboardType="phone-pad"
                        />

                        <TouchableOpacity style={styles.saveBtn} onPress={saveProfile}>
                            <Text style={styles.saveBtnText}>Save Changes</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                            <Text style={styles.cancelBtnText}>Cancel</Text>
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
        elevation: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    profileCard: {
        backgroundColor: '#fff',
        margin: 20,
        borderRadius: 15,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 3,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#e8f5e9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    avatarText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2e7d32',
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    profileSub: {
        color: '#666',
        marginTop: 4,
    },
    editBtn: {
        padding: 10,
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
    actionIcon: {
        backgroundColor: '#ffebee',
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
        padding: 25,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 20,
        fontSize: 16,
    },
    saveBtn: {
        backgroundColor: '#2e7d32',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    saveBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    cancelBtn: {
        padding: 15,
        alignItems: 'center',
    },
    cancelBtnText: {
        color: '#666',
        fontWeight: 'bold',
    }
});

export default SettingsScreen;
