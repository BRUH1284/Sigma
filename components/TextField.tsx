import { TextInput, View, Text, StyleSheet, KeyboardTypeOptions, KeyboardAvoidingView, Platform } from 'react-native';
import React from 'react';
// import { STYLES } from '@/constants/style';
// import { COLORS } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { useStyles } from '@/constants/style';
import DynamicIcon, { IconItem } from "./DynamicIcon";

type Props = {
    label?: string;
    errorMessage?: string;
    placeholder?: string;
    secureTextEntry?: boolean;
    autoCapitalize?: "none" | "sentences" | "words" | "characters";
    onChangeText?: (text: string) => void;
    value?: string;
    keyboardType?: KeyboardTypeOptions;
    icon?: IconItem;
};


const TextField: React.FC<Props> = ({
    label,
    errorMessage,
    placeholder,
    secureTextEntry,
    autoCapitalize,
    onChangeText,
    value,
    keyboardType = "default",
    icon
}) => {
    const styles = useStyles();
    const { colors } = useTheme();

    return (
        <View style={{
            alignSelf: "stretch",
            alignItems: 'baseline',
            justifyContent: "center",
            gap: 4
        }}>
            {label && <Text style={[styles.text, { paddingHorizontal: 16 }]}>{label}</Text>}
            <View style={[
                styles.inputWrapper,
                { flexDirection: "row", alignItems: "center" },
                errorMessage && errorMessage != "" &&
                {
                    borderColor: colors.danger
                }
            ]}>
                {icon && (
                    <DynamicIcon
                        name={icon.name}
                        size={icon.size}
                        library={icon.library}
                        color={icon.color || colors.gray}
                    />
                )}
                <TextInput
                    style={{ width: '100%' }}
                    placeholder={placeholder}
                    placeholderTextColor={colors.gray}
                    secureTextEntry={secureTextEntry}
                    autoCapitalize={autoCapitalize}
                    onChangeText={onChangeText}
                    value={value}
                    keyboardType={keyboardType}
                />
            </View>
            <Text style={[
                styles.text,
                {
                    color: colors.danger
                }
            ]}>{errorMessage}</Text>
        </View >
    );
};

export default TextField;


// const styles = StyleSheet.create({
//     container: {
//         alignSelf: "stretch",
//         alignItems: 'baseline',
//         justifyContent: "center",
//         gap: 4
//     },
//     text: {
//         marginHorizontal: 0
//     },
//     inputRow: {
//         flexDirection: "row",
//         alignItems: "center",
//     }
// });
