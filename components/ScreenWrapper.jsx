import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ScreenWrapper = ({ 
  children, 
  bg = '#fdfdfdff', 
  style, 
}) => {
  const { top } = useSafeAreaInsets();
  const paddingTop = 20;

  return (
    <View style={[{ flex: 1, paddingTop, backgroundColor: bg }, style]}>
      {children}
    </View>
  );
};

export default ScreenWrapper;
