// import { STYLES } from "@/constants/style";
import { useTheme } from '@/context/ThemeContext';
import { useStyles } from '@/constants/style';
import { View, Text } from "react-native";
import IconButton from "./IconButton";


/**
 * Props pre komponentu `ActivityRowAdd`.
 */
type Props = {
    /** Popis aktivity */
    text: string;
    /** MET hodnota aktivity (intenzita v kcal/h) */
    met: number;
    /** Callback pre pridanie aktivity do záznamu */
    onAdd: () => void;
};

/**
 * Riadok s aktivitou na pridanie do denného záznamu.
 *
 * Zobrazuje názov, MET hodnotu a tlačidlo `+` pre pridanie.
 *
 * Používa sa v `SearchPopup` na výber aktivity.
 *
 * @component
 * @param text - Názov aktivity
 * @param met - MET hodnota (kcal/h)
 * @param onAdd - Callback pri kliknutí na tlačidlo „add“
 * @returns JSX komponent s jednou aktivitnou položkou
 */
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
