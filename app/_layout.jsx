import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ImageProvider } from '@/context/ImageContext';
import { supabase } from '@/framework/supabase';
import { getUserData } from '@/services/userServices';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect } from 'react';

const AuthWrapper = ({ children }) => {
  const { user, setAuthUser, setUserData } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const updateUserData = async (user) => {
      if (!user) return;
      const res = await getUserData(user.id);
      if (res.success) setUserData(res.data);
      else console.error('Failed to fetch user data:', res.error);
    };

    const { subscription } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const supabaseUser = session?.user;

      if (supabaseUser) {
        setAuthUser({
          id: supabaseUser.id,
          name: supabaseUser.user_metadata?.full_name ?? '',
          email: supabaseUser.email ?? '',
        });

        await updateUserData(supabaseUser);

        setTimeout(() => router.replace('/(main)/Home'), 0); 
      } else {
        setAuthUser(null);
        setUserData(null);

        setTimeout(() => router.replace('/Welcome'), 0); 
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  if (user === undefined) return null;

  return children;
};

const RootLayout = ({ children }) => {
  return (
    <AuthProvider>
      <ImageProvider>
        <AuthWrapper>
          <Stack screenOptions={{ headerShown: false }}>
            {children}
          </Stack>
        </AuthWrapper>
      </ImageProvider>
    </AuthProvider>
  );
};

export default RootLayout;
