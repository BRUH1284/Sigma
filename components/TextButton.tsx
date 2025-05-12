import { Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { COLORS } from '@/constants/theme'
// import { STYLES } from '@/constants/style';
import { useStyles } from '@/constants/style';
import { useTheme } from '@/context/ThemeContext';

type Props = {
    title: string;
    onPress?: () => void;
}

export default function TextButton({ title: title, onPress }: Props) {
    const styles = useStyles();
    const { colors } = useTheme();

    return (
        <TouchableOpacity
            style={[
                styles.button,
                {
                    marginHorizontal: 64,
                    alignSelf: "stretch",
                }]}
            onPress={onPress}
        >
            <Text style={{ color: colors.onPrimary, fontWeight: "bold" }}>
                {title}
            </Text>
        </TouchableOpacity>
    )
}