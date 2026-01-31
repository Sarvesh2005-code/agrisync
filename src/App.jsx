import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import { initDB } from './db/initDB';
import './localization/i18n';

export default function App() {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const initialize = async () => {
            try {
                await initDB();
                // Add artificial delay or other setup calls here
            } catch (e) {
                console.warn(e);
            } finally {
                setIsReady(true);
            }
        };

        initialize();
    }, []);

    if (!isReady) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#2e7d32" />
                <Text style={{ marginTop: 10 }}>Initializing AgriSync...</Text>
            </View>
        );
    }

    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <BottomTabNavigator />
            </NavigationContainer>
        </SafeAreaProvider>
    );
}
