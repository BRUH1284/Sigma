import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useStyles } from '@/constants/style';
import { useTheme } from '@/context/ThemeContext';
import MessengerScreen from '../(messenger)/messenger';
import { COLORS } from '@/constants/theme';

/**
 * Určuje, či sa aplikácia zobrazuje na tablete podľa šírky obrazovky.
 */
const isTablet = Dimensions.get('window').width >= 700;

/**
 * Komponenta definujúca layout pre navigáciu pomocou tabov.
 *
 * - Na telefónoch zobrazuje štandardnú spodnú tab navigáciu.
 * - Na tabletoch rozdeľuje obrazovku na dve časti: Messenger + obsah tabov.
 *
 * Obsahuje ikony pomocou MaterialIcons a používa tému pre farby a štýly.
 *
 * @returns React komponent s tabuľkovým navigačným layoutom
 */
export default function TabLayout() {
    const styles = useStyles();
    const { colors } = useTheme();

    const tabs = (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.onPrimary,
                tabBarStyle: {
                    backgroundColor: "#202020",
                    paddingVertical: 0,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                }
            }}
        >
            <Tabs.Screen
                name='index'
                options={{
                    tabBarLabel: "Home",
                    tabBarIcon: ({ size, color }) => (
                        <MaterialIcons name="home" size={size} color={color} />
                    )
                }}
            />
            <Tabs.Screen
                name='overview'
                options={{
                    tabBarLabel: "Overview",
                    tabBarIcon: ({ size, color }) => (
                        <MaterialIcons name="calendar-month" size={size} color={color} />
                    )
                }}
            />
            <Tabs.Screen
                name='profile'
                options={{
                    tabBarLabel: "Profile",
                    tabBarIcon: ({ size, color }) => (
                        <MaterialIcons name="person" size={size} color={color} />
                    )
                }}
            />
        </Tabs>
    );

    /**
     * Ak je zariadenie tablet, rozloží layout do dvoch stĺpcov.
     */
    if (isTablet) {
        return (
            <View style={tabletStyles.container}>
                <View style={tabletStyles.sidebar}>
                    <MessengerScreen />
                </View>
                <View style={tabletStyles.content}>
                    {tabs}
                </View>
            </View>
        );
    }

    return tabs;
}

/**
 * Štýly pre zobrazenie layoutu na tablete.
 */
const tabletStyles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    sidebar: {
        width: '35%',
        borderRightWidth: 1,
        borderColor: '#ddd',
    },
    content: {
        flex: 1,
    },
});
