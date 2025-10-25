import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';

import BackButton from '@/components/BackButton';
import Button from '@/components/Button';
import Input from '@/components/Input';
import ScreenWrapper from '@/components/ScreenWrapper';
import theme from '@/constants/theme';
import { supabase } from '@/framework/supabase';
import { hp, wp } from '@/helpers/common';

const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async () => {
    if (!email || !password) {
      alert('Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        let message = 'Sign in failed. Please try again.';
        if (error.message.includes('Invalid login credentials')) {
          message = 'Incorrect email or password.';
        }
        alert(message);
      } else if (data?.session) {
        router.replace('/(main)/Home');
      }
    } catch (err) {
      alert('Unexpected error occurred. Please try again.');
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
          <Text style={styles.headerText}>Hey,</Text>
          <Text style={styles.headerText}>Welcome Back</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.subText}>Please login to continue</Text>

          {/* Email Input */}
          <Input
            icon={<Icon name="email" size={24} color="gray" />}
            placeholder="Enter your email"
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={setEmail}
            value={email}
          />

          {/* Password Input */}
          <Input
            icon={<Icon name="lock" size={24} color="gray" />}
            placeholder="Enter your password"
            secureTextEntry
            onChangeText={setPassword}
            value={password}
          />

          <Text style={styles.forgotPassword}>Forgot Password?</Text>

          <Button
            title="Login"
            loading={loading}
            disabled={loading || !email || !password}
            onPress={onSubmit}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <Pressable onPress={() => router.push('/SignUp')} accessibilityRole="button">
            <Text style={[styles.footerText, styles.signupText]}>Signup</Text>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Login;

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
    fontSize: hp(1.8),
    color: theme.colors.text,
  },
  form: {
    gap: 25,
  },
  forgotPassword: {
    textAlign: 'right',
    fontWeight: theme.fonts.semibold || '600',
    color: theme.colors.text,
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
  signupText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
});
