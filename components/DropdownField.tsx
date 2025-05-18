import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DropDownPicker, { DropDownDirectionType } from 'react-native-dropdown-picker';
import { useStyles } from '@/constants/style';
import { COLORS } from '@/constants/theme';
import { useTheme } from '@react-navigation/native';

/**
 * Props pre komponent `DropdownField`.
 */
type Props = {
    /** Popis nad výberovým poľom */
    label?: string;
    /** Zobrazí sa ako chybová hláška, ak je zadaná */
    errorMessage?: string;
    /** Položky výberu – zobrazovaný label a hodnota */
    items: { label: string; value: any }[];
    /** Callback po zmene hodnoty */
    onChangeValue?: (value: any) => void;
    /** Aktuálna hodnota */
    value?: any;
    /** Priorita vrstvy (Z-index) pre overlapy */
    zIndex?: number;
    /** Smer, ktorým sa má dropdown otvoriť */
    dropdownDirection?: DropDownDirectionType;
};

/**
 * Komponent pre štýlovaný dropdown (výber zo zoznamu).
 *
 * Obaluje `react-native-dropdown-picker` a poskytuje podporu pre:
 * - label
 * - chybové hlášky
 * - správne z-index vrstvenie (napr. pri viacerých dropdownoch)
 *
 * @component
 * @param label - Voliteľný text nad výberom
 * @param errorMessage - Chyba, ktorá sa zobrazí pod výberom
 * @param items - Zoznam výberových položiek
 * @param onChangeValue - Funkcia volaná pri zmene hodnoty
 * @param value - Počiatočná hodnota
 * @param zIndex - Z-index komponentu
 * @param dropdownDirection - Smer rozbalenia výberu
 * @returns JSX komponent výberového poľa
 */
const DropdownField: React.FC<Props> = ({
    label,
    errorMessage = "",
    items,
    onChangeValue,
    value,
    zIndex = 1,
    dropdownDirection = 'DEFAULT'
}) => {
    const [open, setOpen] = useState(false);
    const [localValue, setLocalValue] = useState(value);
    const [localItems, setLocalItems] = useState(items);
    const styles = useStyles();
    const { colors } = useTheme();

    return (
        <View style={[{
            alignSelf: "stretch",
            alignItems: 'baseline',
            justifyContent: "center",
            gap: 4
        }, { zIndex }]}>
            {label && <Text style={{ marginHorizontal: 16 }}>{label}</Text>}
            <View style={[
                styles.dropDownWrapper,
                { position: 'relative', zIndex },
                errorMessage !== "" && { borderColor: COLORS.danger }
            ]}>
                <DropDownPicker
                    listMode='SCROLLVIEW'
                    dropDownDirection={dropdownDirection}
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
            <Text style={[{ marginHorizontal: 16 }, { color: COLORS.danger }]}>{errorMessage}</Text>
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