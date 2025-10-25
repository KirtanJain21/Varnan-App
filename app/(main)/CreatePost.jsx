import { Feather, Ionicons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Avatar from '@/components/Avatar';
import Button from '@/components/Button';
import RichTextEditor from '@/components/RichTextEditor';
import ScreenWrapper from '@/components/ScreenWrapper';
import theme from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { hp, wp } from '@/helpers/common';
import { createPost } from '@/services/postService';

const CreatePost = () => {
  const { user } = useAuth();
  const [mediaUri, setMediaUri] = useState(null);
  const [isVideo, setIsVideo] = useState(false);
  const [loading, setLoading] = useState(false);
  const bodyRef = useRef('');
  const editorRef = useRef(null);
  const scrollViewRef = useRef(null);
  const router = useRouter();

  const pickMedia = async (mediaType) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'We need access to your gallery.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        mediaType === 'Images'
          ? ImagePicker.MediaTypeOptions.Images
          : ImagePicker.MediaTypeOptions.Videos,
      quality: 1,
    });

    if (!result.canceled) {
      setMediaUri(result.assets[0].uri);
      setIsVideo(mediaType === 'Videos');
    }
  };

  const resetPostState = () => {
    editorRef.current?.setContentHTML('');
    bodyRef.current = '';
    setMediaUri(null);
    setIsVideo(false);
  };

  const scrollToEnd = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  const onSubmit = async () => {
    const body = bodyRef.current.trim();
    if (!body && !mediaUri) {
      Alert.alert('Error', 'Post content cannot be empty.');
      return;
    }

    setLoading(true);

    const files = mediaUri
      ? [
          {
            uri: mediaUri,
            type: isVideo ? 'video' : 'image',
          },
        ]
      : [];

    try {
      const res = await createPost({ body, files });

      if (res.success) {
        Alert.alert('Success', 'Post created successfully!');
        resetPostState();
        router.back(); 
      } else {
        Alert.alert('Error', res.msg || 'Failed to create post');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Something went wrong while creating post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
      keyboardVerticalOffset={hp(6)}
    >
      <ScreenWrapper>
        <View style={styles.container}>
          <Text style={styles.headerText}>Create Post</Text>

          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={{ gap: hp(2), paddingBottom: hp(28) }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={scrollToEnd}
          >
            {/* User Info */}
            <View style={styles.userInfo}>
              <Avatar
                source={{ uri: user?.image || undefined }}
                style={styles.profileImage}
                rounded={theme.radius.xxl}
              />
              <View>
                <Text style={styles.userName}>{user?.name || 'Anonymous'}</Text>
                <Text style={styles.userVisibility}>Public</Text>
              </View>
            </View>

            {/* Rich Text Editor */}
            <RichTextEditor
              editorRef={editorRef}
              onChange={(body) => {
                bodyRef.current = body;
                scrollToEnd();
              }}
            />

            {/* Media Preview */}
            {mediaUri && (
              <View style={styles.imageWrapper}>
                {isVideo ? (
                  <Video
                    source={{ uri: mediaUri }}
                    style={styles.fullImagePreview}
                    useNativeControls
                    resizeMode="contain"
                    shouldPlay={false}
                  />
                ) : (
                  <Image
                    source={{ uri: mediaUri }}
                    style={styles.fullImagePreview}
                    resizeMode="contain"
                  />
                )}
                <TouchableOpacity
                  onPress={resetPostState}
                  style={styles.deleteImageIcon}
                >
                  <Ionicons name="close-circle" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            )}

            {/* Add to Your Post */}
            <View style={styles.addToPost}>
              <Text style={styles.addToPostText}>Add to your post</Text>
              <View style={styles.addIcons}>
                <TouchableOpacity onPress={() => pickMedia('Images')}>
                  <Ionicons name="image-outline" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => pickMedia('Videos')}>
                  <Feather name="video" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          {/* Fixed Submit Button */}
          <View style={styles.footer}>
            <Button title="Post" loading={loading} onPress={onSubmit} />
          </View>
        </View>
      </ScreenWrapper>
    </KeyboardAvoidingView>
  );
};

export default CreatePost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#130321',
    paddingTop: hp(2),
    paddingHorizontal: wp(5),
    paddingBottom: hp(12),
  },
  headerText: {
    fontSize: wp(5.5),
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'poppins',
    marginBottom: hp(1.5),
    alignSelf: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(3),
  },
  profileImage: {
    width: wp(17),
    height: wp(17),
    borderRadius: wp(9),
  },
  userName: {
    color: 'white',
    fontFamily: 'poppins',
    fontSize: wp(4.7),
  },
  userVisibility: {
    color: '#aaa',
    fontSize: wp(3.9),
    fontFamily: 'poppins',
  },
  addToPost: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#292942',
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(3),
    borderRadius: 30,
  },
  addToPostText: {
    color: 'white',
    fontSize: wp(4),
    fontFamily: 'poppins',
  },
  addIcons: {
    flexDirection: 'row',
    gap: wp(4),
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: hp(34),
    backgroundColor: '#1e1e2f',
    borderRadius: theme.radius.md,
    marginTop: hp(1),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  fullImagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: theme.radius.md,
  },
  deleteImageIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 16,
    padding: 2,
    zIndex: 5,
  },
  footer: {
    position: 'absolute',
    bottom: hp(15),
    left: wp(5),
    right: wp(5),
  },
});
