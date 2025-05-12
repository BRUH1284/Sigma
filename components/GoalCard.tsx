import { Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
// import { COLORS } from '@/constants/theme'
// import { STYLES } from '@/constants/style';
import { useTheme } from '@/context/ThemeContext';
import { useStyles } from '@/constants/style';

import DynamicIcon, { IconItem } from './DynamicIcon';

type Props = {
    current: string;
    goal: string;
    icon: IconItem;
    onPress?: () => void;
}

export default function GoalCard({ current, goal, icon, onPress }: Props) {
    const styles = useStyles();
    const { colors } = useTheme();

    return (
        <TouchableOpacity
            style={[
                styles.button,
                {
                    backgroundColor: colors.secondSurface,
                    flex: 1,
                    height: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    padding: 16,
                    paddingLeft: 8
                }]}
            onPress={onPress}
        >
            <DynamicIcon
                name={icon.name}
                size={icon.size}
                color={icon.color || colors.onSurface}
                library={icon.library}
                style={icon.style}
            />
            <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.header}>{current}</Text>
                <Text style={[styles.text, { color: colors.gray }]}>{goal}</Text>
            </View>
        </TouchableOpacity>
    )
}