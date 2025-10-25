import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import Loading from '@/components/Loading';

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace('/Welcome'); // Navigate to Welcome after delay
    }, 1500);

    return () => clearTimeout(timeout); // Cleanup on unmount
  }, [router]);

  return (
    <View style={styles.container}>
      <Loading />
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#130321', // Matches branding splash background
  },
});
