// import { STYLES } from "@/constants/style";
// import { COLORS } from "@/constants/theme";
import { useTheme } from '@/context/ThemeContext';
import { useStyles } from '@/constants/style';
import { View, Text } from "react-native";
import IconButton from "./IconButton";


type Props = {
    text: string;
    minutes: number;
    kcal: number;
    onDelete: () => void;
};

export default function ActivityRowSummary({ text, minutes, kcal, onDelete }: Props) {
    const styles = useStyles();
    const { colors } = useTheme();

    return (
        <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            gap: 8,
        }}>
            <Text style={[styles.header, {
                flex: 1
            }]}>{text}</Text>
            <View
                style={{
                    width: 1,
                    backgroundColor: colors.lightGray,
                    alignSelf: 'stretch',
                }}
            />
            <View style={{
                alignItems: 'center',
                width: 64
            }}>
                <Text style={styles.header}>{minutes}</Text>
                <Text style={[styles.text, { color: colors.gray }]}>Minutes</Text>
            </View>
            <View style={{ alignItems: 'center', width: 64 }}>
                <Text style={styles.header}>{kcal}</Text>
                <Text style={[styles.text, { color: colors.gray }]}>Kcal</Text>
            </View>
            <IconButton
                style={{
                    backgroundColor: colors.danger,
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
