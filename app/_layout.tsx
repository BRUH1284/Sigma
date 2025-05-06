import InitialLayout from "@/components/InitialLayout";
import { AuthProvider } from "@/context/AuthContext";
import { RegistrationProvider } from "@/context/RegistrationContext";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <AuthProvider>
      <RegistrationProvider>
        <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1 }}>
            <InitialLayout />
          </SafeAreaView>
        </SafeAreaProvider>
      </RegistrationProvider>
    </AuthProvider>
  );
}
