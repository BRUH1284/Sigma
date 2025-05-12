// import { useLocalSearchParams } from 'expo-router';
// import { Text, View } from 'react-native';

// export default function ChatScreen() {
//   const { username } = useLocalSearchParams();  // This will capture the 'username' from the route.

//   return (
//     <View>
//       <Text>Chat with {username}</Text>
//     </View>
//   );
// }
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useMessenger } from '@/hooks/useMessenger';
import { getConversation, sendMessage } from '@/services/messageService';

type Message = {
  id: string;
  senderUsername: string;
  receiverUsername: string;
  content: string;
  sentAt: string;
};

export default function ChatScreen() {
  const { username } = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { onMessageReceived } = useMessenger();

  useEffect(() => {
    const loadMessages = async () => {
      try {
        if (!username) {
          console.log('uwu');
          return;
        }
        const data = await getConversation(username as string);
        setMessages(data);
      } catch (err) {
        console.error('Ошибка загрузки сообщений:', err);
        console.log('uwu2');
      } finally {
        setLoading(false);
      }
    };

    loadMessages();

    // Подписка на новые сообщения в реальном времени
    onMessageReceived(async (sender, content, time) => {
      if (sender === username) {
        setMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(), // Замените на реальный ID от сервера
            senderUsername: sender,
            receiverUsername: '', // Заполните текущим пользователем, если нужно
            content,
            sentAt: time,
          },
        ]);
      }
    });
  }, [username, onMessageReceived]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !username) return;

    try {
      await sendMessage({
        receiverUsername: username as string,
        content: newMessage,
      });
      setNewMessage('');
      // Обновляем список сообщений после отправки
      const updatedMessages = await getConversation(username as string);
      setMessages(updatedMessages);
    } catch (err) {
      console.log('uwuwuw');
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.senderUsername === username
          ? styles.receivedMessage
          : styles.sentMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.content}</Text>
      <Text style={styles.messageTime}>{item.sentAt}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (messages.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Нет сообщений</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Введите сообщение..."
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
            <Text style={styles.sendButtonText}>Отправить</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        // Новые сообщения внизу
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Введите сообщение..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Отправить</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  messageContainer: {
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  sentMessage: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
  },
  receivedMessage: {
    backgroundColor: '#E5E5EA',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
    color: '#000',
  },
  messageTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});