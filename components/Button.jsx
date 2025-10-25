import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { theme } from '@/constants/theme';
import { hp, wp } from '@/helpers/common';

const shadowStyle = {
  shadowColor: theme.colors.text,
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.2,
  shadowRadius: 8,
  elevation: 4,
};

const Button = ({
  title = '',
  onPress = () => {},
  loading = false,
  hasShadow = true,
  disabled = false,
  buttonStyle,
  textStyle,
}) => {
  const isDisabled = loading || disabled;

  return (
    <Pressable
      onPress={!isDisabled ? onPress : undefined}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        hasShadow ? shadowStyle : undefined,
        { opacity: pressed || isDisabled ? 0.7 : 1 },
        buttonStyle,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={theme.colors.primary} />
      ) : (
        <Text style={[styles.text, textStyle]}>{title}</Text>
      )}
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary,
    height: hp(6.6),
    borderRadius: theme.radius.xl,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: wp(90),
  },

  text: {
    color: 'white',
    fontSize: hp(2.2),
    fontWeight: theme.fonts.extrabold,
  },
});
