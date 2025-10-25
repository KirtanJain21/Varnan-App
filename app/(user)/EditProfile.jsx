import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import BackButton from '@/components/BackButton';
import Button from '@/components/Button';
import Icon from '@/components/Icons';
import Input from '@/components/Input';
import ScreenWrapper from '@/components/ScreenWrapper';
import { useAuth } from '@/context/AuthContext';
import { hp, wp } from '@/helpers/common';
import { getUserImageSource, uploadFile } from '@/services/imageService';
import { updateUser } from '@/services/userServices';
import { useRouter } from 'expo-router';

const EditProfile = () => {
  const { user: currentUser, setUserData } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    name: '',
    phoneNumber: '',
    image: '',
    bio: '',
    address: '',
  });

  useEffect(() => {
    if (currentUser) {
      setUser({
        name: currentUser.name || '',
        phoneNumber: currentUser.phoneNumber || '',
        image: currentUser.image || '',
        address: currentUser.address || '',
        bio: currentUser.bio || '',
      });
    }
  }, [currentUser]);

  const onPickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets.length > 0) {
        setUser({ ...user, image: result.assets[0] });
      }
    } catch (err) {
      console.error('ImagePicker error:', err);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const onSubmit = async () => {
    const { name, phoneNumber, address, bio, image } = user;

    if (!name) {
      Alert.alert('Profile', 'Please fill all the fields');
      return;
    }

    setLoading(true);

    try {
      let imagePath = image;

      if (typeof image === 'object' && image.uri) {
        const imageRes = await uploadFile('profiles', image.uri, true);
        if (imageRes.success) {
          imagePath = imageRes.data;
        } else {
          Alert.alert('Image Upload Failed', 'Please try again.');
          setLoading(false);
          return;
        }
      }

      const res = await updateUser(currentUser?.id, {
        name,
        phoneNumber,
        address,
        bio,
        image: imagePath,
      });

      setLoading(false);

      if (res.success) {
        setUserData({ ...currentUser, ...res.data });
        router.back();
      } else {
        Alert.alert('Profile', res.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Update error:', err);
      setLoading(false);
      Alert.alert('Profile', 'Unexpected error occurred');
    }
  };

  const imageSource =
    typeof user.image === 'object'
      ? { uri: user.image.uri }
      : getUserImageSource(user.image);

  return (

      <ScrollView
        style={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <BackButton color="white" backgroundColor="#1f0833" />
          <Text style={styles.headerText}>Edit Profile</Text>
        </View>

        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <Image source={imageSource} style={styles.profileImage} />
          <Pressable style={styles.editIcon} onPress={onPickImage}>
            <Icon type="FontAwesome" name="camera" size={22} color="white" />
          </Pressable>
        </View>

        {/* Inputs */}
        <Input
          placeholder="Enter your name"
          icon={<Icon type="FontAwesome5" name="user" size={22} color="black" />}
          value={user.name}
          onChangeText={(value) => setUser({ ...user, name: value })}
          keyboardType="default"
          containerStyle={styles.inputBox}
        />

        <Input
          placeholder="Enter your address"
          icon={<Icon type="Feather" name="map-pin" size={22} color="black" />}
          value={user.address}
          onChangeText={(value) => setUser({ ...user, address: value })}
          keyboardType="default"
          containerStyle={styles.inputBox}
        />

        <Input
          placeholder="Enter your phone number"
          icon={<Icon type="FontAwesome" name="phone" size={22} color="black" />}
          value={user.phoneNumber}
          onChangeText={(value) => setUser({ ...user, phoneNumber: value })}
          keyboardType="phone-pad"
          containerStyle={styles.inputBox}
        />

        <Input
          placeholder="Enter your bio"
          multiline
          value={user.bio}
          onChangeText={(value) => setUser({ ...user, bio: value })}
          containerStyle={styles.bio}
          numberOfLines={6}
          placeholderTextColor="#aaa"
        />

        {/* Save Button */}
        <Button title="Update" loading={loading} onPress={onSubmit} />
      </ScrollView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#130321',
    paddingTop: hp(3),
    paddingHorizontal: wp(5),
  },
  header: {
    alignItems: 'center',
    marginBottom: hp(2),
  },
  headerText: {
    fontSize: wp(5),
    fontWeight: 'bold',
    color: 'white',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: hp(3),
  },
  profileImage: {
    width: wp(28),
    height: wp(28),
    borderRadius: wp(14),
    backgroundColor: '#ddd',
  },
  editIcon: {
    position: 'absolute',
    bottom: 10,
    right: wp(32),
    backgroundColor: '#444',
    borderRadius: 20,
    padding: 8,
  },
  inputBox: {
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: hp(1.5),
    paddingHorizontal: 10,
  },
  bio: {
    height: hp(20),
    alignItems: 'flex-start',
    borderRadius: hp(2),
    marginBottom: 20,
    backgroundColor: 'white',
    paddingHorizontal: 15,
  },
});
