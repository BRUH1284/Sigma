import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { COLORS } from '@/constants/theme'
import { STYLES } from '@/constants/style';

type Props = {
    label: string;
    onPress?: () => void;
}

export default function TextButton({ label, onPress }: Props) {
    return (
        <TouchableOpacity
            style={[
                STYLES.button,
                {
                    marginHorizontal: 64,
                    alignSelf: "stretch",
                }]}
            onPress={onPress}
        >
            <Text style={{ color: COLORS.light, fontWeight: 'bold' }}>
                {label}
            </Text>
        </TouchableOpacity>
    )
}