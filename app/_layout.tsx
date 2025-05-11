import InitialLayout from "@/components/InitialLayout";
import { AuthProvider } from "@/context/AuthContext";
import { RegistrationProvider } from "@/context/RegistrationContext";
import { Slot } from "expo-router";
import React, { Suspense, useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { drizzle } from 'drizzle-orm/expo-sqlite';
import { SQLiteProvider, openDatabaseSync } from 'expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import migrations from '@/drizzle/migrations';
import { DbDropService } from "@/services/dbDropService";
import { MessengerProvider } from "@/context/MessengerContext";

const DATABASE_NAME = process.env.DATABASE_NAME || 'sigma';

export default function RootLayout() {
  const expoDb = openDatabaseSync(DATABASE_NAME);
  const db = drizzle(expoDb);
  const { success, error } = useMigrations(db, migrations);
  useDrizzleStudio(expoDb);

  // const dropDatabaseService = DbDropService();
  // dropDatabaseService.dropDatabase();

  useEffect(() => {
    console.log("Drizzle Database Error:", error);
    console.log("Drizzle Database Success:", success);
  }, [success]);

  return (
    <Suspense fallback={<ActivityIndicator size="large" />}>
      <SQLiteProvider databaseName={DATABASE_NAME} options={{ enableChangeListener: true }} useSuspense>
        <AuthProvider>
          <MessengerProvider>

            <RegistrationProvider>
              <SafeAreaProvider>
                <SafeAreaView style={{ flex: 1 }}>
                  <Slot />
                  <InitialLayout />
                </SafeAreaView>
              </SafeAreaProvider>
            </RegistrationProvider>
          </MessengerProvider>
        </AuthProvider>
      </SQLiteProvider>
    </Suspense>
  );
}
