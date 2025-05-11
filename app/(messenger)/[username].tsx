import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function ChatScreen() {
  const { username } = useLocalSearchParams();  // This will capture the 'username' from the route.

  return (
    <View>
      <Text>Chat with {username}</Text>
    </View>
  );
}
