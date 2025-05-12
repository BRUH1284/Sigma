// import { STYLES } from "@/constants/style";
// import { COLORS } from "@/constants/theme";
import { useStyles } from '@/constants/style';
import { useTheme } from '@/context/ThemeContext';
import { View, Text, Pressable } from "react-native";
import IconButton from "./IconButton";
import NumberInputField from "./NumberInputField";


type Props = {
    headerText?: string;
    onBack: () => void;
    acceptText?: string;
    onAccept: () => void;
    text?: string;
    placeholder?: string;
    onChangeNumber: (value: number) => void;
    value: number;
    valueJump?: number
    maxValue?: number
    minValue?: number
    minWidth?: number
};

export default function NumberPopup({
    headerText,
    onBack,
    acceptText,
    onAccept,
    text,
    placeholder,
    onChangeNumber,
    value,
    valueJump,
    maxValue,
    minValue,
    minWidth
}: Props) {
    const styles = useStyles();
    const { colors } = useTheme();
    return (
        <Pressable
            style={styles.popup}
            onPress={(e) => e.stopPropagation()}
        >
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%',
                gap: 8,
                position: 'relative'
            }}>
                <IconButton
                    style={{
                        position: 'absolute',
                        backgroundColor: colors.surface
                    }}
                    icon={{
                        size: 24,
                        name: 'arrow-back',
                        library: 'MaterialIcons',
                    }}
                    onPress={onBack}
                />
                <Text
                    style={[styles.header, {
                        textAlign: 'center',
                        flex: 1,
                        zIndex: -1
                    }]}
                    numberOfLines={2}
                >{headerText}</Text>
            </View>
            <Text style={[styles.text, { width: '100%', textAlign: 'center' }]}>{text}</Text>
            <NumberInputField
                value={value}
                onChangeNumber={onChangeNumber}
                placeholder={placeholder}
                valueJump={valueJump}
                maxValue={maxValue}
                minValue={minValue}
                minWidth={minWidth}
            />
            <View style={{
                flexDirection: 'row',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 8,
            }}>
                <Text style={[styles.text, { fontSize: 16 }]}>{acceptText}</Text>
                <IconButton
                    icon={{
                        size: 32,
                        name: 'done',
                        library: 'MaterialIcons',
                    }}
                    onPress={onAccept}
                />
            </View>
        </Pressable>
    )
}
