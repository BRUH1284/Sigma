import { View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useStyles } from '@/constants/style';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pedometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const router = useRouter();
  const { colors } = useTheme();

  const [steps, setSteps] = useState(0);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    Pedometer.isAvailableAsync().then(setIsAvailable);

    const subscription = Pedometer.watchStepCount(result => {
      setSteps(result.steps);
      AsyncStorage.setItem('steps', result.steps.toString());
    });

    AsyncStorage.getItem('steps').then(stored => {
      if (stored !== null) {
        setSteps(parseInt(stored));
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <SafeAreaView style={{ padding: 16, backgroundColor: colors.background, flex: 1 }}>
      {/* Верхняя панель */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.surface }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.onPrimary }}>Sigma</Text>
        <TouchableOpacity
          style={{
            height: 32,
            aspectRatio: 1,
            borderRadius: 32,
            backgroundColor: colors.gray,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => router.push('/(messenger)/messenger')}
        >
          <MaterialIcons name="message" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Блок шагомера */}
      <View
        style={{
          marginTop: 24,
          padding: 16,
          borderRadius: 12,
          backgroundColor: colors.background,
          elevation: 2, // тень на Android
          shadowColor: colors.onBackground, // тень на iOS
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
        }}
      >
        <Text style={{ fontSize: 18, marginBottom: 8, color: colors.onPrimary }}>Step Tracker</Text>
        <Text style={{ fontSize: 16, color: colors.onPrimary }}>
          {isAvailable === false ? 'Pedometer is not available' : `Steps today: ${steps}`}
        </Text>
      </View>
    </SafeAreaView>
  );
}
