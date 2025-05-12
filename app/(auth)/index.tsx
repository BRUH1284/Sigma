import TextButton from '@/components/TextButton'
// import { COLORS } from '@/constants/theme'
import { useStyles } from '@/constants/style';
import { useTheme } from '@/context/ThemeContext';
import { Link, router } from 'expo-router'
import { View, Text, StyleSheet } from 'react-native'

export default function Welcome() {
    const styles = useStyles();
    const { colors } = useTheme();
    return (
        <View style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            gap: 16
        }}>
            <Text>Welcome</Text>
            <TextButton title='Create an account' onPress={() => router.push("/registration")} />
            <Link
                href={"/login"}
                style={{
                    color: colors.onBackground,
                    textDecorationLine: "underline"
                }}
            >
                I have existing account
            </Link>
        </View >
    )
}

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         alignItems: "center",
//         justifyContent: "center",
//         gap: 16
//     }
// })