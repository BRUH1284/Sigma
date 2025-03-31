import { TextInput, View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { STYLES } from '@/constants/style';
import { COLORS } from '@/constants/theme';

type Props = {
    label?: string;
    errorMessage?: string;
    placeholder?: string;
    secureTextEntry?: boolean;
    autoCapitalize?: "none" | "sentences" | "words" | "characters";
    onChangeText?: (text: string) => void;
    value?: string;
};

const TextField: React.FC<Props> = ({ label, errorMessage = "", placeholder, secureTextEntry, autoCapitalize, onChangeText, value }) => {
    return (
        <View style={styles.container}>
            {label && <Text style={styles.text}>{label}</Text>}
            <View style={[
                STYLES.inputWrapper,
                errorMessage != "" &&
                {
                    borderColor: COLORS.danger
                }
            ]}>
                <TextInput
                    placeholder={placeholder}
                    secureTextEntry={secureTextEntry}
                    autoCapitalize={autoCapitalize}
                    onChangeText={onChangeText}
                    value={value}
                />
            </View>
            <Text style={[
                styles.text,
                {
                    color: COLORS.danger
                }
            ]}>{errorMessage}</Text>
        </View >
    );
};

export default TextField;


const styles = StyleSheet.create({
    container: {
        marginHorizontal: 32,
        alignSelf: "stretch",
        alignItems: 'baseline',
        justifyContent: "center",
        gap: 4
    },
    text: {
        marginHorizontal: 16
    },
});
