import BackButton from '@/components/BackButton';
import Icon from '@/components/Icons';
import ScreenWrapper from '@/components/ScreenWrapper';
import { hp, wp } from '@/helpers/common';
import React from 'react';
import {
  Image,
  Linking,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const DeveloperPage = () => {
  const handleLinkPress = (url) => {
    Linking.openURL(url).catch((err) =>
      console.error('Error opening link: ', err)
    );
  };

  return (
      <SafeAreaView style={styles.container}>
        <BackButton color="white" backgroundColor="#1f0833" />
        <Text style={styles.header}>About the Developer</Text>

        <Image
          source={require('@/assets/images/myphoto.jpg')}
          style={styles.profileImage}
        />

        <Text style={styles.name}>Kirtan Jain</Text>
        <Text style={styles.bio}>
          Just a passionate dev learning something new 💻
        </Text>

        <View style={styles.socialIcons}>
          <Pressable
            style={styles.iconButton}
            accessibilityLabel="GitHub"
            onPress={() => handleLinkPress('https://github.com/kethro')}
          >
            <Icon type="FontAwesome" name="github" size={30} color="white" />
          </Pressable>
          <Pressable
            style={styles.iconButton}
            accessibilityLabel="Twitter"
            onPress={() => handleLinkPress('https://twitter.com/kethro')}
          >
            <Icon type="FontAwesome" name="twitter" size={30} color="#1DA1F2" />
          </Pressable>
          <Pressable
            style={styles.iconButton}
            accessibilityLabel="LinkedIn"
            onPress={() => handleLinkPress('https://linkedin.com/in/kethro')}
          >
            <Icon type="FontAwesome" name="linkedin" size={30} color="#0077B5" />
          </Pressable>
          <Pressable
            style={styles.iconButton}
            accessibilityLabel="Email"
            onPress={() => handleLinkPress('mailto:kethro@example.com')}
          >
            <Icon type="Entypo" name="mail" size={30} color="#ccc" />
          </Pressable>
        </View>
      </SafeAreaView>
  );
};

export default DeveloperPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#130321',
    alignItems: 'center',
    paddingTop: hp(2),
    paddingHorizontal: wp(5),
  },
  header: {
    fontSize: wp(6),
    fontWeight: 'bold',
    color: 'white',
    marginBottom: hp(2),
    fontFamily: 'poppins',
  },
  profileImage: {
    width: wp(40),
    height: wp(40),
    borderRadius: wp(30),
    marginBottom: hp(2),
    borderWidth: 3,
    borderColor: '#8900ff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  name: {
    fontSize: wp(5),
    fontWeight: 'bold',
    color: 'white',
    marginBottom: hp(1),
    fontFamily: 'poppins',
  },
  bio: {
    fontSize: wp(4),
    color: '#ccc',
    textAlign: 'center',
    marginBottom: hp(3),
    fontFamily: 'poppins',
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '80%',
    marginTop: hp(2),
  },
  iconButton: {
    padding: hp(1),
  },
});
