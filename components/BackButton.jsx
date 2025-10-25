import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { theme } from '@/constants/theme';

const BackButton = ({
  size = 26,
  color = 'black',
  backgroundColor = 'rgba(33, 33, 33, 0.07)',
}) => {
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => navigation.goBack()}
      style={[styles.button, { backgroundColor }]}
    >
      <Ionicons name="arrow-back" size={size} color={color} />
    </Pressable>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  button: {
    top: 20,
    padding: 5,
    alignSelf: 'flex-start',
    borderRadius: theme.radius.sm,
  },
});
