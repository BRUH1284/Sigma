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
import { useRouter } from 'expo-router';
import { UserSummary } from '@/types/userTypes';
import { api } from '@/api/api'; 
import { Image } from 'react-native';

export default function UserSearchScreen() {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const searchUsers = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setUsers([]);
      return;
    }

    setLoading(true);
    try {
      const response = await api.get(`/users/search`, {
        params: { query: searchQuery },
      });

      setUsers(response.data); // уже массив UserSummary
    } catch (err) {
      console.error('❌ Error searching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      searchUsers(query);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const renderUser = ({ item }: { item: UserSummary }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() =>
        router.push({
          pathname: '/(messenger)/[username]',
          params: { username: item.userName },
        })
      }
    >
      <View style={styles.userRow}>
      <Image
        source={
          item.profilePictureUrl
            ? { uri: item.profilePictureUrl }
            : require('@/assets/images/icon.png') 
        }
        style={styles.avatar}
      />
      <Text style={styles.username}>
        {item.userName}
      </Text>
    </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchHeader}>
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Search users..."
          autoFocus
        />
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.userName}
          renderItem={renderUser}
          ListEmptyComponent={<Text style={styles.emptyText}>No users found</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  searchHeader: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
  },
  cancelButton: {
    padding: 10,
  },
  cancelButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  userItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#555',
  },
  loader: {
    marginTop: 20,
  },
  userRow: {
  flexDirection: 'row',
  alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },

});
