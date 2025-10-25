import { Tabs, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Avatar from '@/components/Avatar';
import Icon from '@/components/Icons';
import { useAuth } from '@/context/AuthContext';
import ScreenWrapper from '@/components/ScreenWrapper';
import { supabase } from '@/framework/supabase';
import { StatusBar } from 'expo-status-bar';
import { createUserData, getUserData } from '@/services/userServices'; 

const Layout = () => {
  const { user, setAuthUser, setUserData } = useAuth();
  const router = useRouter();

  const updateUserData = async (user) => {
    if (!user) return;

    const res = await getUserData(user.id);
    if (res.success) {
      setUserData({
        ...res.data,
        email: user?.email ?? '',
      });
    } else {
      if (res.error === 'User not found') {
        const createRes = await createUserData({
          id: user.id,
          email: user.email ?? '',
          name: user.user_metadata?.full_name ?? '',
        });

        if (createRes.success) {
          setUserData(createRes.data);
        } else {
          console.error('Failed to create user data:', createRes.error);
        }
      } else {
        console.error('Failed to fetch user data:', res.error);
      }
    }
  };

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const supabaseUser = session?.user;

        if (supabaseUser) {
          setAuthUser({
            id: supabaseUser.id,
            name: supabaseUser.user_metadata?.full_name,
            email: supabaseUser.email ?? '',
          });

          await updateUserData(supabaseUser);
          router.replace('/(main)/Home');
        } else {
          setAuthUser(null);
          router.replace('/Welcome');
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  return (
    <ScreenWrapper bg="white">
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#00FFC2',
          tabBarInactiveTintColor: '#888',
          tabBarStyle: {
            position: 'absolute',
            bottom: 35,
            left: 20,
            right: 20,
            height: 70,
            borderRadius: 35,
            backgroundColor: '#130321',
            borderTopWidth: 0,
            elevation: 5,
            paddingBottom: 10,
            shadowColor: '#00FFC2',
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.3,
            shadowRadius: 5,
          },
        }}
      >
        {/* Home Tab */}
        <Tabs.Screen
          name="Home"
          options={{
            tabBarLabel: () => null,
            tabBarIcon: ({ color, focused }) => (
              <View style={{ alignItems: 'center', justifyContent: 'center', top: 15 }}>
                <Icon type="FontAwesome5" name="home" size={28} color={color} />
                <Text style={{ fontSize: 12, color, marginTop: 4 }}>Home</Text>
              </View>
            ),
          }}
        />


        {/* Messages Tab */}
        <Tabs.Screen
          name="Messages"
          options={{
            tabBarLabel: () => null,
            tabBarIcon: ({ color, focused }) => (
              <View style={{ alignItems: 'center', justifyContent: 'center', top: 15 }}>
                <Icon type="Ionicons" name="chatbox-ellipses-outline" size={28} color={color} />
                <Text style={{ fontSize: 12, color }}>Chat</Text>
              </View>
            ),
          }}
        />

        {/* CreatePost Tab (floating center button) */}
        <Tabs.Screen
          name="CreatePost"
          options={{
            tabBarButton: (props) => (
              <TouchableOpacity
                {...props}
                style={{
                  top: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#00FFC2',
                  width: 70,
                  height: 70,
                  borderRadius: 35,
                  shadowColor: '#00FFC2',
                  shadowOffset: { width: 0, height: 5 },
                  shadowOpacity: 0.6,
                  shadowRadius: 5,
                  elevation: 5,
                }}
              >
                <Icon type="AntDesign" name="plus-circle" size={60} color="#fff" />
              </TouchableOpacity>
            ),
          }}
        />

        {/* Notifications Tab */}
        <Tabs.Screen
          name="Notifications"
          options={{
            tabBarLabel: () => null,
            tabBarIcon: ({ color }) => (
              <View style={{ alignItems: 'center', justifyContent: 'center', top: 15 }}>
                <Icon type="FontAwesome5" name="bell" size={28} color={color} />
                <Text style={{ fontSize: 10, color }}>Notification</Text>
              </View>
            ),
          }}
        />

        {/* Profile Tab */}
        <Tabs.Screen
          name="Profile"
          options={{
            tabBarLabel: () => null, // remove default label
            tabBarIcon: ({ focused }) => (
              <View style={{ alignItems: 'center', justifyContent: 'center', top: 15 }}>
                <Avatar
                  size={40}
                  source={{ uri: user?.image ?? '' }}
                  style={{
                    borderWidth: 2,
                    borderColor: focused ? '#00FFC2' : '#888',
                    borderRadius: 9999,
                    shadowColor: '#00FFC2',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.6,
                    shadowRadius: 5,
                    elevation: 5,
                  }}
                />
                <Text
                  style={{
                    fontSize: 10,
                    color: focused ? '#00FFC2' : '#888',
                    marginTop: 4, 
                  }}
                >Profile
                </Text>
              </View>
            ),
          }}
        />
      </Tabs>
    </ScreenWrapper>
  );
};

export default Layout;
