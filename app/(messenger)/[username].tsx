import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function ChatScreen() {
  const { username } = useLocalSearchParams();

  return (
    <View>
      <Text>Chat with {username}</Text>
    </View>
  );
}
