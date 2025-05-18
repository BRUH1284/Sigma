import { StyleSheet } from "react-native";
import { COLORS } from "./theme";
import { useTheme } from "@/context/ThemeContext";

export const useStyles = () => {
    const { colors } = useTheme();

    return StyleSheet.create({
        container: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            padding: 16,
            backgroundColor: colors.surface,
        },
        containerAvoid: {
            flex: 1,
            justifyContent: "center",
            padding: 16,
            paddingBottom: 32,
            gap: 16,
            backgroundColor: colors.surface
        },
        overlay: {
            flex: 1,
            backgroundColor: "#00000088",
            justifyContent: "center",
            alignItems: "center",
            padding: 16,
            paddingVertical: 64,
        },
        popup: {
            backgroundColor: colors.surface,
            padding: 16,
            marginVertical: 64,
            borderRadius: 24,
            width: "100%",
            alignItems: "center",
            elevation: 4,
            gap: 16,
        },
        card: {
            backgroundColor: colors.secondSurface,
            elevation: 4,
            padding: 16,
            borderRadius: 24,
            flexShrink: 1,
        },
        title: {
            fontSize: 24,
            fontWeight: "bold",
            color: colors.onSurface,
        },
        header: {
            fontSize: 18,
            color: colors.onSurface,
        },
        text: {
            fontSize: 14,
            color: colors.onSurface,
        },
        errorText: {
            fontSize: 14,
            color: colors.danger,
        },
        tabBarStyle: {
            backgroundColor: colors.onBackground,
            borderTopWidth: 0,
            borderRadius: 20,
            marginHorizontal: 10,
            marginBottom: 10,
            height: 60,
            position: "absolute",
            bottom: 0,
            left: 10,
            right: 10,
        },
        button: {
            backgroundColor: colors.primary,
            elevation: 4,
            borderRadius: 24,
            height: 48,
            alignItems: "center",
            justifyContent: "center",
        },
        inputWrapper: {
            alignSelf: "stretch",
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.surface,
            elevation: 4,
            borderRadius: 24,
            paddingHorizontal: 12,
            justifyContent: "center",
            height: 48,
        },
        dropDownWrapper: {
            alignSelf: "stretch",
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.surface,
            elevation: 4,
            borderRadius: 24,
            justifyContent: "center",
            height: 48,
        },
    });
};

// export const STYLES = StyleSheet.create({
//     container: {
//         flex: 1,
//         alignItems: "center",
//         justifyContent: "center",
//         gap: 16,
//         padding: 16,
//         backgroundColor: COLORS.surface
//     },
//     overlay: {
//         flex: 1,
//         backgroundColor: "#00000088",
//         justifyContent: "center",
//         alignItems: "center",
//         padding: 16,
//         paddingVertical: 64,
//     },
//     popup: {
//         backgroundColor: COLORS.surface,
//         padding: 16,
//         borderRadius: 24,
//         width: '100%',
//         alignItems: 'center',
//         elevation: 4,
//         gap: 16
//     },
//     card: {
//         backgroundColor: COLORS.secondSurface,
//         elevation: 4,
//         padding: 16,
//         borderRadius: 24,
//         flexShrink: 1
//     },
//     title: {
//         fontSize: 24,
//         fontWeight: "bold",
//         color: COLORS.onSurface
//     },
//     header: {
//         fontSize: 18,
//         color: COLORS.onSurface
//     },
//     text: {
//         fontSize: 14,
//         color: COLORS.onSurface
//     },
//     errorText: {
//         fontSize: 14,
//         color: COLORS.danger
//     },
//     tabBarStyle: {
//         backgroundColor: COLORS.onBackground,
//         borderTopWidth: 0, // Remove the default top border
//         borderRadius: 20, // Set the border radius
//         marginHorizontal: 10, // Add some horizontal margin
//         marginBottom: 10, // Add some bottom margin
//         height: 60, // Adjust height as needed
//         position: 'absolute', // Position absolute for better styling
//         bottom: 0, // Stick to bottom
//         left: 10, // Align with margin
//         right: 10, // Align with margin
//     },
//     button: {
//         backgroundColor: COLORS.primary,
//         elevation: 4,
//         borderRadius: 24,
//         height: 48,
//         alignItems: 'center',
//         justifyContent: 'center'
//     },
//     inputWrapper: {
//         alignSelf: "stretch",
//         backgroundColor: COLORS.surface,
//         borderWidth: 1,
//         borderColor: COLORS.surface,
//         elevation: 4,
//         borderRadius: 24,
//         paddingHorizontal: 12,
//         justifyContent: 'center',
//         height: 48,
//     },
//     dropDownWrapper: {
//         alignSelf: "stretch",
//         backgroundColor: COLORS.surface,
//         borderWidth: 1,
//         borderColor: COLORS.surface,
//         elevation: 4,
//         borderRadius: 24,
//         justifyContent: 'center',
//         height: 48,
//     }
// });