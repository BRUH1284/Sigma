import TextButton from '@/components/TextButton'
import { COLORS } from '@/constants/theme'
import { Link, router } from 'expo-router'
import { View, Text, StyleSheet } from 'react-native'

export default function Welcome() {
    return (
        <View style={styles.container}>
            <Text>Welcome</Text>
            <TextButton title='Create an account' onPress={() => router.push("/registration")} />
            <Link
                href={"/login"}
                style={{
                    color: COLORS.onBackground,
                    textDecorationLine: "underline"
                }}
            >
                I have existing account
            </Link>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 16
    }
})