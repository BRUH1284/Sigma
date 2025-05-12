import React from "react";
import { TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import DynamicIcon, { IconItem } from "./DynamicIcon";
import { useTheme } from '@/context/ThemeContext';
import { useStyles } from '@/constants/style';
import { COLORS } from "@/constants/theme";

export type Props = {
    icon: IconItem;
    onPress?: () => void;
    style?: ViewStyle;
};

export default function IconButton({ icon, onPress, style }: Props) {
    const styles = useStyles();
    const { colors } = useTheme();

    return (
        <TouchableOpacity
            style={[{
                aspectRatio: 1,
                borderRadius: 1000,
                backgroundColor: colors.primary,
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "flex-start",
            }, style]}
            onPress={onPress}
        >
            <DynamicIcon
                name={icon.name}
                size={icon.size}
                color={icon.color || colors.onSurface}
                library={icon.library}
                style={{ marginHorizontal: 4 }}
            />
        </TouchableOpacity>
    );
}

// const styles = StyleSheet.create({
//     button: {
//         aspectRatio: 1,
//         borderRadius: 1000,
//         backgroundColor: COLORS.primary,
//         justifyContent: "center",
//         alignItems: "center",
//         alignSelf: "flex-start",
//     },
// });
