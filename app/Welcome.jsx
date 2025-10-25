import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import Button from '@/components/Button';
import ScreenWrapper from '@/components/ScreenWrapper';
import theme from '@/constants/theme';
import { hp, wp } from '@/helpers/common';

const Welcome = () => {
  return (
    <ScreenWrapper bg="white">
      <StatusBar style="dark" />
      <View style={styles.container}>
        {/* Top Image */}
        <Image
          source={require('@/assets/images/welcome.png')}
          style={styles.welcomeImage}
          resizeMode="contain"
        />

        {/* Text Content */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>VARNAN APP!</Text>
          <Text style={styles.subtitle}>
            Where every thought finds a home and every image tells a story.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Button
            title="Getting Started"
            buttonStyle={{
              marginHorizontal: wp(5),
              marginBottom: hp(3),
            }}
            onPress={() => router.push('/SignUp')}
          />

          <View style={styles.bottomTextContainer}>
            <Text style={styles.bottomText}>Already have an account? </Text>
            <Pressable onPress={() => router.push('/Login')}>
              <Text style={[styles.bottomText, styles.loginText]}>Login</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    paddingHorizontal: wp(5),
  },
  welcomeImage: {
  height: hp(40),   // limit the height
  resizeMode: 'contain',
  alignSelf: 'center',
},
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: wp(8),
  },
  footer: {
    width: '100%',
    paddingBottom: hp(2),
  },
  title: {
    color: '#19ce09ff',
    fontSize: hp(4),
    fontWeight: 'bold',
    marginBottom: hp(2),
  },
  subtitle: {
    fontSize: hp(1.8),
    color: theme.colors.text,
    textAlign: 'center',
  },
  bottomTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomText: {
    color: theme.colors.text,
    fontSize: hp(2),
    fontWeight: theme.fonts.bold,
  },
  loginText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
});
