import { STYLES } from "@/constants/style";
import { COLORS } from "@/constants/theme";
import { View, Text, FlatList, Pressable } from "react-native";
import IconButton from "./IconButton";
import TextField from "./TextField";


type Props = {
    headerText: string;
    onBack: () => void;
    onChangeText?: (text: string) => void;
    textFieldValue?: string;
    headerRightElement?: React.ReactNode;
    flatListComponentProps: any[];
    flatListComponent: React.ElementType;
};

export default function SearchPopup({
    headerText,
    onBack,
    onChangeText,
    textFieldValue,
    headerRightElement,
    flatListComponentProps,
    flatListComponent }: Props) {
    const renderItem = ({ item }: any) => {
        // Dynamically render the component with its properties
        const Component = flatListComponent;
        return <Component {...item} />;
    };

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
            }}>
                <IconButton
                    style={{ backgroundColor: COLORS.surface }}
                    icon={{
                        size: 24,
                        name: 'arrow-back',
                        library: 'MaterialIcons',
                    }}
                    onPress={onBack}
                />
                <Text style={[
                    STYLES.header,
                    {
                        textAlign: 'center',
                        flex: 1
                    }]}>{headerText}</Text>
                {headerRightElement}
            </View>
            <TextField
                placeholder="Search"
                icon={{ size: 24, name: 'search', library: 'MaterialIcons' }}
                onChangeText={onChangeText}
                value={textFieldValue}
            />
            <FlatList
                data={flatListComponentProps}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
            />
        </Pressable>
    )
}
