import { StyleSheet } from "react-native";
import { COLORS } from "./theme";

export const STYLES = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 8
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20
    },
    errorText: {
        fontSize: 12,
        color: COLORS.danger
    },
    tabBarStyle: {
        backgroundColor: COLORS.onBackground,
        borderTopWidth: 0, // Remove the default top border
        borderRadius: 20, // Set the border radius
        marginHorizontal: 10, // Add some horizontal margin
        marginBottom: 10, // Add some bottom margin
        height: 60, // Adjust height as needed
        position: 'absolute', // Position absolute for better styling
        bottom: 0, // Stick to bottom
        left: 10, // Align with margin
        right: 10, // Align with margin
    },
    button: {
        backgroundColor: COLORS.primary,
        elevation: 4,
        borderRadius: 21,
        height: 42,
        alignItems: 'center',
        justifyContent: 'center'
    },
    inputWrapper: {
        alignSelf: "stretch",
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.surface,
        elevation: 4,
        borderRadius: 21,
        paddingHorizontal: 12,
        justifyContent: 'center',
        height: 42,
    }
});