import React from "react";
import { TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import DynamicIcon, { IconItem } from "./DynamicIcon";
import { COLORS } from "@/constants/theme";

export type IconButton = {
    icon: IconItem;
    onPress?: () => void;
    style?: ViewStyle;
};

export default function IconButton({ icon, onPress, style }: IconButton) {
    return (
        <TouchableOpacity
            style={[styles.button, style]}
            onPress={onPress}
        >
            <DynamicIcon
                name={icon.name}
                size={icon.size}
                color={icon.color || COLORS.onSurface}
                library={icon.library}
                style={{ marginHorizontal: 4 }}
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        aspectRatio: 1,
        borderRadius: 1000,
        backgroundColor: COLORS.primary,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "flex-start",
    },
});
