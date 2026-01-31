import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import HomeScreen from '../screens/HomeScreen';
import CropScreen from '../screens/CropScreen';
import SoilScreen from '../screens/SoilScreen';
import AiAssistantScreen from '../screens/AiAssistantScreen';
import DiseaseScreen from '../screens/DiseaseScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    const { t } = useTranslation();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Crop') {
                        iconName = focused ? 'leaf' : 'leaf-outline';
                    } else if (route.name === 'Soil') {
                        iconName = focused ? 'layers' : 'layers-outline';
                    } else if (route.name === 'AI') {
                        iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
                    } else if (route.name === 'Settings') {
                        iconName = focused ? 'settings' : 'settings-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#2e7d32', // Material Green 800
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: t('nav.home') }}
            />
            <Tab.Screen
                name="Crop"
                component={CropScreen}
                options={{ title: t('nav.crop') }}
            />
            <Tab.Screen
                name="Soil"
                component={SoilScreen}
                options={{ title: t('nav.soil') }}
            />
            <Tab.Screen
                name="AI"
                component={AiAssistantScreen}
                options={{ title: 'AgriSahayak' }}
            />
            <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{ title: t('nav.settings') }}
            />
            <Tab.Screen
                name="Disease"
                component={DiseaseScreen}
                options={{
                    title: 'Plant Clinic',
                    tabBarButton: () => null // Hide from tab bar
                }}
            />
        </Tab.Navigator>
    );
};

export default BottomTabNavigator;
