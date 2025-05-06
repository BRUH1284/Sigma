import InitialLayout from "@/components/InitialLayout";
import { AuthProvider } from "@/context/AuthContext";
import { RegistrationProvider } from "@/context/RegistrationContext";
import { Slot } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <AuthProvider>
      <RegistrationProvider>
        <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1 }}>

            <Slot />
            <InitialLayout />
          </SafeAreaView>
        </SafeAreaProvider>
      </RegistrationProvider>
    </AuthProvider>
  );
}
