import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const OfflineBanner = () => {
    const [isConnected, setIsConnected] = useState(true);
    const [slideAnim] = useState(new Animated.Value(-100));
    const insets = useSafeAreaInsets();

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            const connected = state.isConnected === true && state.isInternetReachable !== false;
            
            // Only trigger animation if state actually changes
            if (connected !== isConnected) {
                setIsConnected(connected);
                
                if (!connected) {
                    // Slide down to show
                    Animated.timing(slideAnim, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,
                    }).start();
                } else {
                    // Slide up to hide
                    Animated.timing(slideAnim, {
                        toValue: -100,
                        duration: 300,
                        useNativeDriver: true,
                    }).start();
                }
            }
        });

        // Initialize state
        NetInfo.fetch().then(state => {
            setIsConnected(state.isConnected === true && state.isInternetReachable !== false);
        });

        return () => unsubscribe();
    }, [isConnected, slideAnim]);

    if (isConnected) return null;

    return (
        <Animated.View style={[
            styles.container, 
            { 
                transform: [{ translateY: slideAnim }],
                paddingTop: insets.top || 20 // Account for notch on iOS/Android
            }
        ]}>
            <Ionicons name="cloud-offline" size={20} color="#fff" style={styles.icon} />
            <Text style={styles.text}>No Internet Connection. Some features may be limited.</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#d32f2f', // Red for error/warning
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 10,
        paddingHorizontal: 15,
        zIndex: 9999, // Ensure it's always on top
        elevation: 10,
    },
    icon: {
        marginRight: 8,
    },
    text: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    }
});

export default OfflineBanner;
