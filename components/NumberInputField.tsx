import { View, Text, StyleSheet, TextInput, ViewStyle } from "react-native";
import IconButton from "./IconButton";
import { IconItem } from "./DynamicIcon";
// import { COLORS } from "@/constants/theme";
import { useStyles } from '@/constants/style';
import { useTheme } from '@/context/ThemeContext';
import { useEffect, useState } from "react";

type Props = {
    placeholder?: string;
    onChangeNumber?: (value: number) => void;
    decrementIcon?: IconItem;
    incrementIcon?: IconItem;
    value: number;
    valueJump?: number
    maxValue?: number
    minValue?: number
    minWidth?: number
};


export default function NumberInputField({
    placeholder,
    onChangeNumber,
    decrementIcon = { name: "remove", size: 24, library: "MaterialIcons" },
    incrementIcon = { name: "add", size: 24, library: "MaterialIcons" },
    value,
    valueJump = 5,
    maxValue = 2 ** 31,
    minValue = 0,
    minWidth = 48
}: Props) {
    const styles = useStyles();
    const { colors } = useTheme();
    const [displayedValue, setDisplayedValue] = useState('');

    const handleChangeValue = (value: string | number) => {
        let parsed: number;
        if (typeof value == 'string') {
            if (value === '' || value === '-') {
                setDisplayedValue(value);
                onChangeNumber?.(0);
                return;
            } else if (value.endsWith('.')) {
                setDisplayedValue(value);
                return;
            }

            parsed = +value || 0;
        } else
            parsed = value;

        if (maxValue < parsed)
            parsed = maxValue;
        if (minValue > parsed)
            parsed = minValue;

        onChangeNumber?.(parsed);
        setDisplayedValue(parsed.toString());

    }

    return (
        <View style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
        }}>
            <IconButton icon={decrementIcon} onPress={() => handleChangeValue(value - valueJump)} />
            <TextInput
                style={[{textAlign: "center",
                        fontSize: 16,
                        paddingVertical: 4,
                        paddingHorizontal: 8,
                        borderBottomWidth: 1,
                        borderColor: colors.lightGray,}, { minWidth: minWidth }]}
                keyboardType="numeric"
                value={displayedValue}
                placeholder={placeholder}
                onChangeText={handleChangeValue}
            />
            <IconButton icon={incrementIcon} onPress={() => handleChangeValue(value + valueJump)} />
        </View>
    );
}

// const styles = StyleSheet.create({
//     container: {
//         flexDirection: "row",
//         alignItems: "center",
//         gap: 12,
//     },
//     input: {
//         textAlign: "center",
//         fontSize: 16,
//         paddingVertical: 4,
//         paddingHorizontal: 8,
//         borderBottomWidth: 1,
//         borderColor: COLORS.lightGray,
//     },
// });