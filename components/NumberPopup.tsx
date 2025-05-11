import { STYLES } from "@/constants/style";
import { COLORS } from "@/constants/theme";
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
    return (
        <Pressable
            style={STYLES.popup}
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
                        backgroundColor: COLORS.surface
                    }}
                    icon={{
                        size: 24,
                        name: 'arrow-back',
                        library: 'MaterialIcons',
                    }}
                    onPress={onBack}
                />
                <Text
                    style={[STYLES.header, {
                        textAlign: 'center',
                        flex: 1,
                        zIndex: -1
                    }]}
                    numberOfLines={2}
                >{headerText}</Text>
            </View>
            <Text style={[STYLES.text, { width: '100%', textAlign: 'center' }]}>{text}</Text>
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
                <Text style={[STYLES.text, { fontSize: 16 }]}>{acceptText}</Text>
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
