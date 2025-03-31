import { Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { COLORS } from '@/constants/theme'
import { STYLES } from '@/constants/style';

type Props = {
    title: string;
    onPress?: () => void;
}

export default function TextButton({ title: title, onPress }: Props) {
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
            <Text style={{ color: COLORS.onPrimary, fontWeight: "bold" }}>
                {title}
            </Text>
        </TouchableOpacity>
    )
}