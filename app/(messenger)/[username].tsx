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
import { useTheme } from '@/context/ThemeContext';

/**
 * Typ reprezentujúci správu v konverzácii.
 */
type Message = {
  /** Unikátne ID správy */
  id: string;
  /** Používateľ, ktorý správu poslal */
  senderUsername: string;
  /** Používateľ, ktorý správu prijal */
  receiverUsername: string;
  /** Obsah správy */
  content: string;
  /** Čas odoslania správy */
  sentAt: string;
};

/**
 * Obrazovka pre chat s konkrétnym používateľom.
 * 
 * Načítava predchádzajúce správy, zobrazuje ich a umožňuje odosielanie nových.
 * Používa parametre z adresy (`username`) a komunikuje s `messageService`.
 * Obsahuje aj živé aktualizácie cez `useMessenger()`.
 * 
 * @returns Komponenta chatovacej obrazovky
 */
export default function ChatScreen() {
  const { username } = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { onMessageReceived } = useMessenger();
  const { colors } = useTheme();
  const styles = getStyles(colors);

  /**
   * Načítanie existujúcich správ a nastavenie odberu na nové správy.
   */
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

    // Živý odber na nové správy
    onMessageReceived(async (sender, content, time) => {
      if (sender === username) {
        setMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(), 
            senderUsername: sender,
            receiverUsername: '', 
            content,
            sentAt: time,
          },
        ]);
      }
    });
  }, [username, onMessageReceived]);

  /**
   * Funkcia pre odoslanie správy.
   * Po odoslaní obnoví konverzáciu.
   */
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

  /**
   * Render jednej správy v zozname.
   * @param item Správa
   * @returns JSX element reprezentujúci správu
   */
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
            placeholder="Your message..."
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
            <Text style={styles.sendButtonText}>Send</Text>
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
          placeholder="Your message..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/**
 * Dynamický štýlovací objekt závislý od aktuálnej témy.
 * @param colors Farby z témy
 * @returns StyleSheet objekt
 */
const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    marginTop: 30,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.onBackground,
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
    backgroundColor: colors.primary,
    alignSelf: 'flex-end',
  },
  receivedMessage: {
    backgroundColor: colors.secondSurface,
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
    color: colors.onPrimary,
  },
  messageTime: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: colors.thirdSurface,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.thirdSurface,
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: colors.secondary,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: colors.onSecondary,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});