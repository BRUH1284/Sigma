import TextButton from '@/components/TextButton'
// import { COLORS } from '@/constants/theme'
import { useStyles } from '@/constants/style';
import { useTheme } from '@/context/ThemeContext';
import { Link, router } from 'expo-router'
import { View, Text, StyleSheet } from 'react-native'

/**
 * Komponenta uvítacej obrazovky.
 * 
 * Zobrazí privítanie, tlačidlo na registráciu nového účtu 
 * a odkaz pre existujúcich používateľov na prihlasovaciu obrazovku.
 * 
 * Používa vlastné štýly a farby zo svetlej / tmavej témy.
 * 
 * @returns React Native View s uvítacími prvkami
 */
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