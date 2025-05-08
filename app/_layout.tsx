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
import * as FileSystem from 'expo-file-system';

export const DATABASE_NAME = 'sigma';

export default function RootLayout() {
  const expoDb = openDatabaseSync(DATABASE_NAME);
  const db = drizzle(expoDb);
  const { success, error } = useMigrations(db, migrations);
  useDrizzleStudio(expoDb);

  // const dbPath = `${FileSystem.documentDirectory}SQLite/${DATABASE_NAME}`;

  // const fileExists = FileSystem.getInfoAsync(dbPath);
  // if ((await fileExists).exists) {
  //   await FileSystem.deleteAsync(dbPath, { idempotent: true });
  //   console.log('Database deleted');
  // } else {
  //   console.log('Database file does not exist');
  // }

  useEffect(() => {
    console.log("Drizzle Database Error:", error);
    console.log("Drizzle Database Success:", success);
  }, [success]);

  return (
    <Suspense fallback={<ActivityIndicator size="large" />}>
      <SQLiteProvider databaseName={DATABASE_NAME} options={{ enableChangeListener: true }} useSuspense>
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
      </SQLiteProvider>
    </Suspense>
  );
}
