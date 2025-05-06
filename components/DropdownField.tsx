import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { STYLES } from '@/constants/style';
import { COLORS } from '@/constants/theme';

type Props = {
    label?: string;
    errorMessage?: string;
    items: { label: string; value: any }[];
    placeholder?: string;
    onChangeValue?: (value: any) => void;
    value?: any;
    zIndex?: number;
};

const DropdownField: React.FC<Props> = ({ label, errorMessage = "", items, placeholder, onChangeValue, value, zIndex = 1 }) => {
    const [open, setOpen] = useState(false);
    const [localValue, setLocalValue] = useState(value);
    const [localItems, setLocalItems] = useState(items);

    return (
        <View style={[styles.container, { zIndex }]}>
            {label && <Text style={styles.text}>{label}</Text>}
            <View style={[
                STYLES.dropDownWrapper,
                { position: 'relative', zIndex },
                errorMessage !== "" && { borderColor: COLORS.danger }
            ]}>
                <DropDownPicker
                    open={open}
                    setOpen={setOpen}
                    items={localItems}
                    value={localValue}
                    setValue={(callback) => {
                        const val = callback(localValue);
                        setLocalValue(val);
                        if (onChangeValue) onChangeValue(val);
                    }}
                    zIndex={zIndex}
                    style={{
                        borderWidth: 0,
                        backgroundColor: 'transparent',
                    }}
                    disableBorderRadius={false}
                    dropDownContainerStyle={
                        {
                            elevation: 4,
                            borderRadius: 24,
                            marginVertical: 8,
                            borderColor: COLORS.background,
                        }}
                />
            </View>
            <Text style={[styles.text, { color: COLORS.danger }]}>{errorMessage}</Text>
        </View>

    );
};

export default DropdownField;

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