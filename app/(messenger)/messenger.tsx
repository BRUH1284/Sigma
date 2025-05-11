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
import {
  connectToChatHub,
  onMessageReceived,
  stopConnection,
} from '@/services/signalrService';
import { authService } from '@/services/authService';

type Chat = {
  username: string;
  lastMessage: string;
  sentAt: string;
};

export default function MessengerScreen() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  const { profile, profileLoading, fetchMyProfile } = useProfile();
  const router = useRouter();

  useEffect(() => {
  const load = async () => {
    try {
      const token = authService.getAccessToken();
      if (!token) {
        console.error('⛔️ Токен не найден');
        return;
      }

      await fetchMyProfile(); // ⚠️ позже, не раньше токена

      if (!profile?.userName) return;

      console.log('🔐 Подключаюсь к SignalR с токеном:', token);
      await connectToChatHub(profile.userName, token);

      const data = await getChats();
      setChats(data); // временно без фильтра

      onMessageReceived(async () => {
        const updated = await getChats();
        setChats(updated);
      });
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

  if (loading || profileLoading || !profile) {
    return <ActivityIndicator style={{ marginTop: 30 }} />;
  }

  if (chats.length === 0) {
    return <Text style={{ textAlign: 'center', marginTop: 30 }}>Нет чатов</Text>;
  }

  return (
    <FlatList
      data={chats}
      keyExtractor={(chat) => `${chat.username}-${chat.sentAt}`}
      renderItem={renderItem}
    />
  );
}

const styles = StyleSheet.create({
  chatItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#555',
  },
});
