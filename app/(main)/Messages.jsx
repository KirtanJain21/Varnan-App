import ScreenWrapper from '@/components/ScreenWrapper';
import { hp, wp } from '@/helpers/common';
import { useRouter } from 'expo-router';
import React, { memo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

const chats = [
  { id: '1', name: 'Eren', message: 'Have you ever been there?', time: '14:28' },
  { id: '2', name: 'Goku', message: 'It is very nice of you', time: '12:19' },
  { id: '3', name: 'Ethan', message: 'Wait a minute', time: '12:19' },
  { id: '4', name: 'Kokushibo', message: 'Send me a mail', time: '14:28' },
  { id: '5', name: 'Zenitsu', message: "That's great.", time: '12:19' },
  { id: '6', name: 'Rengoku', message: 'What to eat tonight', time: '14:28' },
  { id: '7', name: 'Gojo', message: "Then, let's change a light", time: '14:28' },
];

// Utility → Generate consistent color
const getAvatarColor = (name) => {
  const colors = ['#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#f97316', '#0ea5e9', '#ec4899'];
  return colors[name.charCodeAt(0) % colors.length];
};

// Utility → Get initials
const getInitials = (name) => {
  const parts = name.split(' ');
  if (parts.length > 1) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.charAt(0).toUpperCase();
};

const ChatItem = memo(({ item, onPress }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.chatItem,
      { backgroundColor: pressed ? '#2a0a45' : '#1f0833ff' },
    ]}
  >
    <View style={[styles.avatar, { backgroundColor: getAvatarColor(item.name) }]}>
      <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
    </View>
    <View style={styles.chatTextContainer}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.message} numberOfLines={1} ellipsizeMode="tail">
        {item.message}
      </Text>
    </View>
    <Text style={styles.time}>{item.time}</Text>
  </Pressable>
));

const ChatPage = () => {
  const router = useRouter();

  const handleChatPress = (chat) => {
    router.push(`/chat/${chat.id}`); 
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.heading}>Chats</Text>
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatItem item={item} onPress={() => handleChatPress(item)} />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No chats yet. Start a conversation!</Text>
          }
        />
      </View>
    </ScreenWrapper>
  );
};

export default ChatPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#130321',
    paddingTop: hp(3),
  },
  heading: {
    fontSize: hp(3),
    fontWeight: 'bold',
    marginBottom: hp(2),
    marginTop: hp(1),
    marginHorizontal: wp(4),
    color: 'white',
  },
  list: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(2),
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: hp(1.5),
    borderRadius: wp(2),
    marginBottom: hp(1.5),
  },
  avatar: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(3),
  },
  avatarText: {
    color: 'white',
    fontSize: hp(2.2),
    fontWeight: 'bold',
  },
  chatTextContainer: {
    flex: 1,
  },
  name: {
    fontSize: hp(2.1),
    fontWeight: 'bold',
    color: 'white',
  },
  message: {
    fontSize: hp(1.8),
    color: '#ccc',
    marginTop: hp(0.5),
  },
  time: {
    fontSize: hp(1.6),
    color: '#888',
    marginLeft: wp(2),
  },
  emptyText: {
    color: '#aaa',
    fontSize: hp(2),
    textAlign: 'center',
    marginTop: hp(10),
  },
});
