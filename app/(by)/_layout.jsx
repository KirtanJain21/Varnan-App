import { Stack } from 'expo-router';
import React from 'react';

const _layout = () => {
  return (
    <Stack
      screenOptions={{
        animation: 'slide_from_right',
        headerShown: false,
      }}
    />
  );
};

export default _layout;
