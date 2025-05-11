import { STYLES } from "@/constants/style";
import { COLORS } from "@/constants/theme";
import { View, Text } from "react-native";
import IconButton from "./IconButton";


type Props = {
    text: string;
    minutes: number;
    kcal: number;
    onDelete: () => void;
};

export default function ActivityRowSummary({ text, minutes, kcal, onDelete }: Props) {
    return (
        <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            gap: 8,
        }}>
            <Text style={[STYLES.header, {
                flex: 1
            }]}>{text}</Text>
            <View
                style={{
                    width: 1,
                    backgroundColor: COLORS.lightGray,
                    alignSelf: 'stretch',
                }}
            />
            <View style={{
                alignItems: 'center',
                width: 64
            }}>
                <Text style={STYLES.header}>{minutes}</Text>
                <Text style={[STYLES.text, { color: COLORS.gray }]}>Minutes</Text>
            </View>
            <View style={{ alignItems: 'center', width: 64 }}>
                <Text style={STYLES.header}>{kcal}</Text>
                <Text style={[STYLES.text, { color: COLORS.gray }]}>Kcal</Text>
            </View>
            <IconButton
                style={{
                    backgroundColor: COLORS.danger,
                    alignSelf: 'center',
                }}
                icon={{
                    size: 32,
                    name: 'delete',
                    library: 'MaterialIcons',
                }}
                onPress={onDelete}
            />
        </View>
    )
}
