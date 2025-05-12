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

type Chat = {
  username: string;
  lastMessage: string;
  sentAt: string;
};

export default function MessengerScreen() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  const { profileLoading } = useProfile();
  const { connectToChatHub, onMessageReceived, stopConnection } = useMessenger();
  const router = useRouter();

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
        <Text style={styles.emptyText}>Нет чатов</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
