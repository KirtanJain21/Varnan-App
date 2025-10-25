import React from 'react';
import { StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { theme } from '@/constants/theme';
import { hp } from '@/helpers/common';
import { getUserImageSource } from '@/services/imageService';

const Avatar = ({ source, size = hp(4.5), rounded = theme.radius.md, style }) => {
  return (
    <Image
      source={getUserImageSource(source?.uri)}
      transition={100}
      style={[
        styles.avatar,
        {
          height: size,
          width: size,
          borderRadius: rounded,
        },
        style,
      ]}
    />
  );
};

export default Avatar;

const styles = StyleSheet.create({
  avatar: {
    borderCurve: 'continuous',
    borderColor: theme.colors.border,
    borderWidth: 1,
  },
});
