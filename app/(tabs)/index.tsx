import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import { COLORS } from '@/constants/theme'
import { useRouter } from 'expo-router'

export default function Index() {
    const router = useRouter();

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text>Sigma</Text>
            <TouchableOpacity
                style={{
                    height: 32,
                    aspectRatio: 1,
                    borderRadius: 32,
                    backgroundColor: COLORS.gray,
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