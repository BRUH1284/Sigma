import InitialLayout from "@/components/InitialLayout";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <InitialLayout />
        </SafeAreaView>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
