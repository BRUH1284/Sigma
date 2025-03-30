import { StyleSheet } from "react-native";
import { COLORS } from "./theme";

export const STYLES = StyleSheet.create({
    tabBarStyle: {
        backgroundColor: COLORS.dark,
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
        padding: 12,
        borderRadius: 32,
        alignItems: 'center',
    }
});