import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import { getChats } from '@/services/messageService';
import { useProfile } from '@/hooks/useProfile';
import { useRouter } from 'expo-router';
import { useMessenger } from '@/hooks/useMessenger';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/context/ThemeContext';

/**
 * Reprezentuje jeden chat kontakt s poslednou prijatou alebo odoslanou správou.
 */
type Chat = {
  /** Používateľské meno adresáta alebo kontaktu. */
  username: string;
  /** Posledná správa z tejto konverzácie. */
  lastMessage: string;
  /** Dátum a čas poslednej správy. */
  sentAt: string;
};

/**
 * Obrazovka pre zobrazenie zoznamu chatov používateľa.
 *
 * Umožňuje prejsť do konkrétnej konverzácie alebo spustiť nový chat.
 * Po načítaní sa prepne z loading state na zoznam alebo správu o prázdnom inboxe.
 *
 * @returns React komponent obrazovky pre správu chatov
 */
export default function MessengerScreen() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  const { profileLoading } = useProfile();
  const { connectToChatHub, onMessageReceived, stopConnection } = useMessenger();
  const router = useRouter();
  const { colors } = useTheme();
  const styles = getStyles(colors);

  /**
   * Načítava konverzácie a nastavuje live listener na nové správy.
   */
  useEffect(() => {
    const load = async () => {
      try {

        console.log(123);

        if (!connectToChatHub || !onMessageReceived) {
          alert("Logout service is unavailable.");
          return;
        }

        await connectToChatHub();

        const data = await getChats();
        setChats(data); // временно без фильтра

        await onMessageReceived(async (sender, content, time) => {
          console.log(`📩 Message from ${sender} at ${time}: ${content}`);
          const updatedChats = await getChats();
          setChats(updatedChats);
        });

        // onMessageReceived(async () => {
        //   const updated = await getChats();
        //   setChats(updated);
        // });
      } catch (err) {
        console.error('❌ Ошибка:', err);
      } finally {
        setLoading(false);
      }
    };

    load();

    return () => {
      stopConnection();
    };
  }, []);

  /**
   * Render jednej položky zoznamu konverzácií.
   * @param item - Jeden chat objekt
   * @returns JSX element so štýlovaným kontaktom
   */
  const renderItem = ({ item: chat }: { item: Chat }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() =>
        router.push({
          pathname: '/(messenger)/[username]',
          params: { username: chat.username },
        })
      }
    >
      <Text style={styles.username}>{chat.username}</Text>
      <Text style={styles.message} numberOfLines={1}>
        {chat.lastMessage}
      </Text>
    </TouchableOpacity>
  );


  // if (chats.length === 0) {
  //   return <Text style={{ textAlign: 'center', marginTop: 30 }}>Нет чатов</Text>;
  // }

  // return (
  //   <FlatList
  //     data={chats}
  //     keyExtractor={(chat) => `${chat.username}-${chat.sentAt}`}
  //     renderItem={renderItem}
  //   />
  // );
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.newMessageButton}
        onPress={() => router.push('/(messenger)/search')}
      >
        <Text style={styles.newMessageButtonText}>New Message</Text>
      </TouchableOpacity>
      {chats.length === 0 ? (
        <Text style={styles.emptyText}>No chats</Text>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(chat) => `${chat.username}-${chat.sentAt}`}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

/**
 * Dynamicky generované štýly podľa aktuálnej farebnej schémy témy.
 *
 * @param colors - Objekt s farbami z aktuálnej témy
 * @returns StyleSheet objekt pre komponent
 */
const getStyles = (colors: any) => StyleSheet.create({
  chatItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: colors.thirdSurface,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    color: colors.onPrimary
  },
  message: {
    fontSize: 14,
    color: colors.gray,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    marginTop: 30,
  },
  newMessageButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 10,
    alignSelf: 'flex-end',
  },
  newMessageButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#555',
  },
});
