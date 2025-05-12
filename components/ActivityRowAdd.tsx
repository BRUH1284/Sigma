// import { STYLES } from "@/constants/style";
import { useTheme } from '@/context/ThemeContext';
import { useStyles } from '@/constants/style';
import { View, Text } from "react-native";
import IconButton from "./IconButton";


type Props = {
    text: string;
    met: number;
    onAdd: () => void;
};

export default function ActivityRowAdd({ text, met, onAdd }: Props) {
    const styles = useStyles();

    return (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 8,
                gap: 8,
                width: '100%',
                justifyContent: 'space-between',
            }}
        >
            <Text style={{
                flex: 1,
            }}>{text}</Text>
            <Text style={[styles.text, { flexShrink: 0, textAlign: 'center' }]}>{`${met}\nkcal/h`}</Text>
            <IconButton
                style={{ alignSelf: 'center' }}
                icon={{ size: 24, name: 'add', library: 'MaterialIcons' }}
                onPress={onAdd}
            />
        </View>
    )
}
