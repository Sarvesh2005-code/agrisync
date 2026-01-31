import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

const Insight48hScreen = () => {
    const { t } = useTranslation();
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{t('nav.insights')}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default Insight48hScreen;
