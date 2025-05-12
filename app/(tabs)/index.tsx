import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { MaterialIcons } from '@expo/vector-icons'
// import { COLORS } from '@/constants/theme'
import { useStyles } from '@/constants/style';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router'

export default function Index() {
    const router = useRouter();
    const styles = useStyles();
    const { colors } = useTheme();
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text>Sigma</Text>
            <TouchableOpacity
                style={{
                    height: 32,
                    aspectRatio: 1,
                    borderRadius: 32,
                    backgroundColor: colors.gray,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                onPress={() => router.push('/(messenger)/messenger')}
            >
                <MaterialIcons name="message" size={20} color="#000" />
            </TouchableOpacity>
        </View>
    )
}