import Avatar from '@/components/Avatar';
import Icon from '@/components/Icons';
import ScreenWrapper from '@/components/ScreenWrapper';
import theme from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useImage } from '@/context/ImageContext';
import { supabase } from '@/framework/supabase';
import { hp, wp } from '@/helpers/common';
import { getSupabaseFileUrl } from '@/services/imageService';
import { router } from 'expo-router';
import { getUserImageSource } from "@/services/imageService";
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const Profile = () => {
  const { user } = useAuth();
  const { setSelectedImage } = useImage();
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Utility to parse media
  const parseMedia = (file) => {
    let media = [];
    if (!file) return media;
    try {
      const parsed = JSON.parse(file);
      if (Array.isArray(parsed)) {
        media = parsed.map(f => ({ path: getSupabaseFileUrl(f.path || f), type: f.type || 'image' }));
      } else if (typeof parsed === 'string') {
        media = [{ path: getSupabaseFileUrl(parsed), type: 'image' }];
      }
    } catch {
      media = [{ path: getSupabaseFileUrl(file), type: 'image' }];
    }
    return media;
  };

  // Fetch posts for current user
  const fetchUserPosts = async () => {
  if (!user?.id) return;

  try {
    setLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select(`
        id,
        body,
        file,
        created_at,
        userId,
        users:userId (id, name, image)
      `)
      .eq('userId', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const formatted = data.map(post => {
      let media = [];
      if (post.file) {
        try {
          const parsed = JSON.parse(post.file);
          if (Array.isArray(parsed)) media = parsed.map(f => ({ path: f.path, type: f.type || 'image' }));
        } catch {
          console.warn('Failed to parse post.file:', post.file);
        }
      }
      return {
        id: post.id,
        body: post.body || '',
        media,
        username: post.users?.name || 'Anonymous',
        photo: getUserImageSource(post.users?.image),
        createdAt: post.created_at,
      };
    });

    setUserPosts(formatted);
  } catch (err) {
    console.error('fetchUserPosts error:', err);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};


  // Pull-to-refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUserPosts();
  };

  // Redirect if logged out
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) router.replace('/Login');
    });
    return () => authListener?.subscription?.unsubscribe();
  }, []);

  // Fetch user posts on mount and whenever user changes
  useEffect(() => {
    fetchUserPosts();
  }, [user]);

  const handleLogout = async () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            router.replace('/Welcome');
          } catch (error) {
            Alert.alert('Logout Error', error.message || 'Failed to log out.');
          }
        },
      },
    ]);
  };

  const renderHeader = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.headerText}>Profile</Text>
        <Pressable onPress={handleLogout}>
          <Icon type="MaterialIcons" name="logout" size={28} color="white" />
        </Pressable>
      </View>

      <View style={styles.bio}>
        <View style={styles.avatarContainer}>
          <Avatar
            source={user?.image ? { uri: user.image } : require('@/assets/images/user.png')}
            style={styles.profileImage}
            rounded={theme.radius.xxl}
          />
          <Pressable style={styles.editIcon} onPress={() => router.push('/EditProfile')}>
            <Icon type="FontAwesome" name="pencil-square-o" size={24} color="#ffffffff" />
          </Pressable>
        </View>
        <View style={styles.about}>
          <Text style={styles.usernametext}>{user?.name || 'Anonymous'}</Text>
          <Text style={styles.biotext}>{user?.bio || 'No bio added yet.'}</Text>
        </View>
      </View>

      <View style={styles.contactContainer}>
        <View style={styles.contactBox}>
          <Icon type="Feather" name="mail" size={20} color="white" />
          <Text style={styles.contactText}>{user?.email}</Text>
        </View>
        {user?.phoneNumber && (
          <View style={styles.contactBox}>
            <Icon type="FontAwesome" name="phone" size={20} color="white" />
            <Text style={styles.contactText}>{user.phoneNumber}</Text>
          </View>
        )}
      </View>

      <Text style={styles.posttitle}>Posts</Text>
    </>
  );

  return (
    <ScreenWrapper>
      <FlatList
        data={userPosts}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        numColumns={3}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          !loading && <Text style={styles.emptyText}>No posts yet. Share your first post!</Text>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              if (item.media[0]) {
                setSelectedImage(item.media[0].path);
                router.push('/(user)/imageGallery');
              }
            }}
          >
            {item.media[0] ? (
              <Image style={styles.postImage} source={{ uri: item.media[0].path }} />
            ) : (
              <Text style={{ color: 'white' }}>No media</Text>
            )}
          </Pressable>
        )}
      />
    </ScreenWrapper>
  );
};

export default Profile;

const styles = StyleSheet.create({
  header: {
    height: hp(6),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    backgroundColor: '#130321',
  },
  headerText: {
    fontSize: wp(5),
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'poppins',
  },
  bio: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: wp(2),
  },
  avatarContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  profileImage: {
    width: wp(26),
    height: wp(26),
    borderWidth: 0,
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: wp(5),
    padding: 6,
  },
  about: {
    alignItems: 'center',
    marginTop: hp(1),
  },
  usernametext: {
    fontSize: wp(4.5),
    fontWeight: 'bold',
    fontFamily: 'poppins',
    color: 'white',
  },
  biotext: {
    fontFamily: 'poppins',
    color: '#ccc',
    fontSize: wp(3.8),
    marginTop: hp(0.5),
  },
  contactContainer: {
    marginTop: hp(2),
    paddingHorizontal: wp(6),
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: hp(2.5),
  },
  contactBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1.5),
    gap: wp(3),
  },
  contactText: {
    fontSize: wp(3.5),
    color: 'white',
    fontFamily: 'poppins',
  },
  posttitle: {
    fontSize: wp(5),
    fontWeight: 'bold',
    color: 'white',
    margin: hp(1),
    fontFamily: 'poppins',
  },
  contentContainer: {
    paddingBottom: hp(50),
    paddingHorizontal: wp(2),
    backgroundColor: '#130321',
  },
  postImage: {
    width: wp(30),
    aspectRatio: 1,
    borderRadius: wp(2),
    margin: wp(1),
  },
  emptyText: {
    color: '#aaa',
    fontSize: wp(4),
    textAlign: 'center',
    marginTop: hp(5),
  },
});
