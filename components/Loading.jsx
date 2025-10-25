import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { theme } from '@/constants/theme';

const Loading = ({ size = 'large', color = theme.colors.primary, style }) => {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
  },
});
