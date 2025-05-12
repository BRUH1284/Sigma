import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
// import { STYLES } from '@/constants/style';
// import { COLORS } from '@/constants/theme';
import { useStyles } from '@/constants/style';
import { useTheme } from '@/context/ThemeContext';

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
    const styles = useStyles();
    const { colors } = useTheme();

    return (
        <View style={[{alignSelf: "stretch",
                        alignItems: 'baseline',
                        justifyContent: "center",
                        gap: 4}, { zIndex }]}>
            {label && <Text style={{marginHorizontal: 16}}>{label}</Text>}
            <View style={[
                styles.dropDownWrapper,
                { position: 'relative', zIndex },
                errorMessage !== "" && { borderColor: colors.danger }
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
                            borderColor: colors.background,
                        }}
                />
            </View>
            <Text style={[{marginHorizontal: 16}, { color: colors.danger }]}>{errorMessage}</Text>
        </View>

    );
};

export default DropdownField;

// const styles = StyleSheet.create({
//     container: {
//         alignSelf: "stretch",
//         alignItems: 'baseline',
//         justifyContent: "center",
//         gap: 4
//     },
//     text: {
//         marginHorizontal: 16
//     },
// });