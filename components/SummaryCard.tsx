// import { STYLES } from "@/constants/style";
import { useTheme } from '@/context/ThemeContext';
import { useStyles } from '@/constants/style';
import React from "react";
import { View, Text, FlatList, RefreshControl } from "react-native";
import IconButton from "./IconButton";

type Props = {
    headerText: string,
    headerKcal: number,
    onHeaderAddButton?: () => void;
    flatListComponentProps: any[];
    flatListComponent: React.ElementType;
    onRefresh?: () => void;
    refreshing?: boolean;
};

export default function SummaryCard({
    headerText,
    headerKcal,
    onHeaderAddButton,
    flatListComponentProps,
    flatListComponent,
    onRefresh,
    refreshing
}: Props) {
    const renderItem = ({ item }: any) => {
        // Dynamically render the component with its properties
        const Component = flatListComponent;
        return <Component {...item} />;
    };
    const styles = useStyles();
    const { colors } = useTheme();


    return (
        <View style={[styles.card, { gap: 16 }]}>
            <View
                style={{
                    alignContent: 'space-between',
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '100%',
                    gap: 16,
                }}
            >
                <Text style={[styles.title, { lineHeight: 32, flex: 1 }]}>{headerText}</Text>
                <Text style={styles.text}>{headerKcal} kcal</Text>
                <IconButton icon={{ size: 32, name: 'add', library: 'MaterialIcons' }} onPress={onHeaderAddButton} />
            </View>
            <FlatList
                data={flatListComponentProps}
                keyExtractor={(item) => item.id.toString()}
                ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
                renderItem={renderItem}
                refreshControl={
                    <RefreshControl refreshing={refreshing ?? false} onRefresh={onRefresh} />
                }
            />
        </View >
    );
}