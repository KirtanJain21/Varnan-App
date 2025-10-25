import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import BackButton from '@/components/BackButton';
import Button from '@/components/Button';
import Input from '@/components/Input';
import ScreenWrapper from '@/components/ScreenWrapper';
import theme from '@/constants/theme';
import { supabase } from '@/framework/supabase';
import { hp, wp } from '@/helpers/common';

const Signup = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const onSubmit = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Missing Fields', 'Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });

      if (error) {
        Alert.alert('Sign up failed', error.message);
      } else if (data?.user) {
        Alert.alert('Success', 'Account created successfully!');
        router.replace('/(main)/Home');
      }
    } catch (err) {
      console.log(err);
      Alert.alert('Sign up failed', 'Unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <BackButton />

        {/* Header */}
        <View>
          <Text style={styles.headerText}>Create,</Text>
          <Text style={styles.headerText}>New Account</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.subText}>Please enter your details to continue</Text>

          <Input
            icon={<Icon name="person" size={24} color="gray" />}
            placeholder="Enter your name"
            onChangeText={setName}
            value={name}
          />
          <Input
            icon={<Icon name="email" size={24} color="gray" />}
            placeholder="Enter your email"
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={setEmail}
            value={email}
          />
          <Input
            icon={<Icon name="lock" size={24} color="gray" />}
            placeholder="Enter your password"
            secureTextEntry
            onChangeText={setPassword}
            value={password}
          />
          <Input
            icon={<Icon name="lock" size={24} color="gray" />}
            placeholder="Confirm your password"
            secureTextEntry
            onChangeText={setConfirmPassword}
            value={confirmPassword}
          />

          <Button
            title="Create Account"
            loading={loading}
            disabled={loading || !email || !password || !confirmPassword || !name}
            onPress={onSubmit}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Pressable onPress={() => router.push('/Login')} accessibilityRole="button">
            <Text style={[styles.footerText, styles.loginText]}>Login</Text>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 45,
    paddingHorizontal: wp(5),
  },
  headerText: {
    fontSize: hp(4),
    fontWeight: theme.fonts.bold || '700',
    color: theme.colors.text,
  },
  subText: {
    fontSize: hp(1.5),
    color: theme.colors.text,
  },
  form: {
    gap: 25,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  footerText: {
    textAlign: 'center',
    color: theme.colors.text,
    fontSize: hp(2),
  },
  loginText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
});
