import React, { forwardRef } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { theme } from '@/constants/theme';
import { hp } from '@/helpers/common';

const Input = forwardRef(({ icon, containerStyle, style, ...rest }, ref) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {icon}
      <TextInput
        ref={ref}
        style={[styles.inputTextStyle, style]}
        placeholderTextColor={theme.colors.text}
        {...rest}
      />
    </View>
  );
});

export default Input;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: hp(7.2),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.4,
    borderColor: theme.colors.text,
    borderRadius: theme.radius.xxl,
    borderCurve: 'continuous',
    paddingHorizontal: 18,
    gap: 12,
  },
  inputTextStyle: {
    flex: 1,
    fontSize: hp(1.9),
    color: theme.colors.text,
    fontFamily: theme.fonts.regular,
  },
});
