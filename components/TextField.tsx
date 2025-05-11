import { TextInput, View, Text, StyleSheet, KeyboardTypeOptions } from 'react-native';
import React from 'react';
import { STYLES } from '@/constants/style';
import { COLORS } from '@/constants/theme';
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
    return (
        <View style={styles.container}>
            {label && <Text style={styles.text}>{label}</Text>}
            <View style={[
                STYLES.inputWrapper,
                styles.inputRow,
                errorMessage && errorMessage != "" &&
                {
                    borderColor: COLORS.danger
                }
            ]}>
                {icon && (
                    <DynamicIcon
                        name={icon.name}
                        size={icon.size}
                        library={icon.library}
                        color={icon.color || COLORS.gray}
                    />
                )}
                <TextInput
                    style={{ flex: 1 }}
                    placeholder={placeholder}
                    placeholderTextColor={COLORS.gray}
                    secureTextEntry={secureTextEntry}
                    autoCapitalize={autoCapitalize}
                    onChangeText={onChangeText}
                    value={value}
                    keyboardType={keyboardType}
                />
            </View>
            {errorMessage && (<Text style={[
                styles.text,
                {
                    color: COLORS.danger
                }
            ]}>{errorMessage}</Text>
            )}
        </View >
    );
};

export default TextField;


const styles = StyleSheet.create({
    container: {
        alignSelf: "stretch",
        alignItems: 'baseline',
        justifyContent: "center",
        gap: 4
    },
    text: {
        marginHorizontal: 0
    },
    inputRow: {
        flexDirection: "row",
        alignItems: "center",
    }
});
