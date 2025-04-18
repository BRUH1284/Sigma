import { Tabs } from 'expo-router'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { COLORS } from '@/constants/theme';
import { AuthProvider } from '@/context/AuthContext';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: COLORS.onPrimary,
                tabBarStyle: {
                    backgroundColor: COLORS.onBackground,
                    borderTopRightRadius: 32,
                    borderTopLeftRadius: 32,
                    height: 64,
                },
                tabBarIconStyle: {
                    flex: 1
                },
                tabBarLabelStyle: {
                    flex: 1
                }
            }}
        >
            <Tabs.Screen
                name='index'
                options={{
                    tabBarLabel: "Home",
                    tabBarIcon: ({ size, color }) => <MaterialIcons name="home" size={size} color={color} />
                }}
            />
            <Tabs.Screen
                name='overview'
                options={{
                    tabBarLabel: "Overview",
                    tabBarIcon: ({ size, color }) => <MaterialIcons name="calendar-month" size={size} color={color} />
                }}
            />
            <Tabs.Screen
                name='statistics'
                options={{
                    tabBarLabel: "Statistics",
                    tabBarIcon: ({ size, color }) => <MaterialIcons name="bar-chart" size={size} color={color} />
                }}
            />
            <Tabs.Screen
                name='profile'
                options={{
                    tabBarLabel: "Profile",
                    tabBarIcon: ({ size, color }) => <MaterialIcons name="person" size={size} color={color} />
                }}
            />
        </Tabs>
    )
}