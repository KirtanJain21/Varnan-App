import Icon from '@/components/Icons';
import ScreenWrapper from '@/components/ScreenWrapper';
import { theme } from '@/constants/theme';
import { useImage } from '@/context/ImageContext'; // ✅ added
import { supabase } from '@/framework/supabase';
import { hp, wp } from '@/helpers/common';
import { getUserImageSource } from "@/services/imageService";
import { Video } from 'expo-av';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions
} from 'react-native';
import RenderHtml from 'react-native-render-html';

const Home = () => {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const { setSelectedImage } = useImage(); // ✅ added

  const [stories, setStories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStories = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("id, name, image");
      if (error) throw error;

      setStories(
        data.map(user => ({
          id: user.id,
          username: user.name,
          photo: getUserImageSource(user.image),
        }))
      );
    } catch (err) {
      console.error("fetchStories error:", err.message);
    }
  };

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          id,
          body,
          file,
          created_at,
          userId,
          users:userId (id, name, image)
        `)
        .order("created_at", { ascending: false });
      if (error) throw error;

      const formatted = data.map(post => {
        let media = [];
        if (post.file) {
          try {
            const parsed = JSON.parse(post.file);
            if (Array.isArray(parsed)) {
              media = parsed.map(f => ({
                path: f.path,
                type: f.type || 'image',
              }));
            }
          } catch (err) {
            console.warn("Failed to parse post.file:", post.file, err);
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
      setPosts(formatted);
    } catch (err) {
      console.error("fetchPosts error:", err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchStories();
    await fetchPosts();
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchStories();
      await fetchPosts();
      setLoading(false);
    };
    init();
  }, []);

  if (loading) {
    return (
      <ScreenWrapper>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8900ff" />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>VarnanApp</Text>
          <View style={styles.icons}>
            <Pressable onPress={() => router.push('/(by)/Maker')}>
              <Icon type="Feather" name="codesandbox" size={30} color="gold" />
            </Pressable>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: hp(10) }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#8900ff"
            />
          }
        >
          {/* Stories */}
          <View style={styles.stories}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} nestedScrollEnabled>
              {stories.map(item => (
                <View key={item.id} style={styles.story}>
                  <Pressable
                    onPress={() => {
                      if (item.photo?.uri) {
                        setSelectedImage(item.photo.uri);
                        router.push('/(user)/imageGallery');
                      }
                    }}
                  >
                    <Image source={item.photo} style={styles.storyImage} />
                  </Pressable>
                  <Text style={styles.username} numberOfLines={1}>
                    {item.username}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Posts */}
          {posts.map(post => (
            <View key={post.id} style={styles.postSection}>
              {/* Post Header */}
              <View style={styles.postHeader}>
                <View style={styles.postHeaderLeft}>
                  {post.photo && (
                    <Image source={post.photo} style={styles.postAvatar} />
                  )}
                  <Text style={styles.postUsername}>{post.username}</Text>
                </View>
                <Icon type="Entypo" name="dots-three-vertical" size={20} color="white" />
              </View>

              {/* Post Media */}
              {post.media.length > 0 ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.postMediaScroll}
                  contentContainerStyle={styles.postMediaContainer}
                >
                  {post.media.map((m, idx) =>
                    m.type === 'video' ? (
                      <Video
                        key={idx}
                        source={{ uri: m.path }}
                        style={styles.postImage}
                        resizeMode="cover"
                        useNativeControls
                      />
                    ) : (
                      <Pressable
                        key={idx}
                        onPress={() => {
                          if (m.path) {
                            setSelectedImage(m.path);
                            router.push('/(user)/imageGallery');
                          }
                        }}
                      >
                        <Image source={{ uri: m.path }} style={styles.postImage} />
                      </Pressable>
                    )
                  )}
                </ScrollView>
              ) : (
                <Text style={styles.noMediaText}>No media</Text>
              )}

              {/* Post Actions */}
              <View style={styles.postActions}>
                <Pressable>
                  <Icon type="FontAwesome5" name="heart" size={28} color="white" />
                </Pressable>
                <Pressable>
                  <Icon type="FontAwesome" name="comments-o" size={28} color="white" />
                </Pressable>
                <Pressable>
                  <Icon type="FontAwesome5" name="paper-plane" size={28} color="white" />
                </Pressable>
                <Pressable>
                  <Icon type="FontAwesome5" name="bookmark" size={28} color="white" />
                </Pressable>
              </View>

              {/* Post Body */}
              <View style={styles.postBio}>
                <Text style={styles.postUsername}>{post.username}</Text>
                <RenderHtml
                  contentWidth={width - wp(8)}
                  source={{ html: post.body }}
                  baseStyle={styles.postBodyText}
                />
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#130321' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    backgroundColor: '#0e0218ff',
  },
  headerText: {
    fontSize: 25,
    color: 'white',
    fontWeight: theme.fonts.bold || '700',
  },
  icons: { flexDirection: 'row', gap: wp(4) },
  stories: {
    height: hp(16),
    paddingVertical: hp(1),
    paddingLeft: wp(2),
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  story: {
    width: wp(22),
    alignItems: 'center',
    marginHorizontal: wp(1),
  },
  storyImage: {
    width: hp(10),
    height: hp(10),
    borderRadius: hp(5),
    borderWidth: 2,
    borderColor: '#8900ff',
  },
  username: {
    color: 'white',
    fontSize: wp(3.5),
    textAlign: 'center',
    marginTop: hp(0.5),
  },
  postSection: {
    marginBottom: hp(3),
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postAvatar: {
    width: hp(5),
    height: hp(5),
    borderRadius: hp(2.5),
    borderWidth: 2,
    borderColor: '#8900ff',
    marginRight: wp(2),
  },
  postUsername: { color: 'white', fontSize: wp(4), fontFamily: 'poppins' },
  postMediaScroll: { marginVertical: hp(1) },
  postMediaContainer: {
    alignItems: 'center',
    paddingHorizontal: wp(1),
  },
  postImage: {
    width: wp(88),
    height: hp(40),
    borderRadius: wp(2),
    marginHorizontal: wp(1),
  },
  noMediaText: { color: 'white', textAlign: 'center', marginVertical: hp(2) },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: hp(1),
    paddingHorizontal: wp(2),
  },
  postBio: {
    flexDirection: 'column',
    paddingHorizontal: wp(2),
  },
  postBodyText: {
    color: 'white',
    fontSize: wp(3.3),
  },
});
