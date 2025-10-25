import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(undefined);

const USER_STORAGE_KEY = 'users';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
        if (storedUser) setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Failed to load user from storage:', err);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    const saveUser = async () => {
      try {
        if (user) {
          await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        } else {
          await AsyncStorage.removeItem(USER_STORAGE_KEY);
        }
      } catch (err) {
        console.error('Failed to save user:', err);
      }
    };
    saveUser();
  }, [user]);

  const setAuthUser = (newUser) => setUser(newUser);

  const setUserData = (data) =>
    setUser((prev) => (prev ? { ...prev, ...data } : prev));

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem(USER_STORAGE_KEY);
  };

  const email = user?.email ?? null;

  return (
    <AuthContext.Provider value={{ user, email, setAuthUser, setUserData, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
