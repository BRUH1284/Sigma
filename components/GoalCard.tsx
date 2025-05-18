import { Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
// import { COLORS } from '@/constants/theme'
// import { STYLES } from '@/constants/style';
import { useTheme } from '@/context/ThemeContext';
import { useStyles } from '@/constants/style';

import DynamicIcon, { IconItem } from './DynamicIcon';

/**
 * Props pre komponent `GoalCard`.
 */
type Props = {
  /** Aktuálna hodnota (napr. „75 kg“) */
  current: string;
  /** Cieľová hodnota (napr. „70 kg“) */
  goal: string;
  /** Ikonka, ktorá reprezentuje typ cieľa (napr. váha, voda) */
  icon: IconItem;
  /** Callback, ktorý sa spustí po kliknutí na kartu */
  onPress?: () => void;
};

/**
 * Komponent `GoalCard` zobrazuje jednu kartu s cieľom používateľa.
 *
 * Používa sa napríklad na zobrazenie cieľovej váhy, množstva vody, spálených kalórií atď.
 * Môže byť interaktívna (voliteľná funkcia `onPress`).
 *
 * Obsahuje:
 * - ikonku (DynamicIcon)
 * - aktuálnu hodnotu (napr. 75 kg)
 * - cieľovú hodnotu (napr. 70 kg)
 *
 * @component
 * @param current - aktuálna hodnota cieľa
 * @param goal - cieľová hodnota
 * @param icon - ikonka reprezentujúca cieľ
 * @param onPress - voliteľná funkcia spustená po kliknutí
 * @returns JSX komponent jednej karty cieľa
 */
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