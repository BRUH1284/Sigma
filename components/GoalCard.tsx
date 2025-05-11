import { Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { COLORS } from '@/constants/theme'
import { STYLES } from '@/constants/style';
import DynamicIcon, { IconItem } from './DynamicIcon';

type Props = {
    current: string;
    goal: string;
    icon: IconItem;
    onPress?: () => void;
}

export default function GoalCard({ current, goal, icon, onPress }: Props) {
    return (
        <TouchableOpacity
            style={[
                STYLES.button,
                {
                    backgroundColor: COLORS.secondSurface,
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
                color={icon.color || COLORS.onSurface}
                library={icon.library}
                style={icon.style}
            />
            <View style={{ alignItems: 'flex-end' }}>
                <Text style={STYLES.header}>{current}</Text>
                <Text style={[STYLES.text, { color: COLORS.gray }]}>{goal}</Text>
            </View>
        </TouchableOpacity>
    )
}