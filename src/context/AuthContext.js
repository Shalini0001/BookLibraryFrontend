import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useEffect, useState } from 'react';
import { requestNotificationPermission, getFcmToken } from '../services/notificationService';
import { API_URL, ENDPOINTS } from '../utils/constants';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const login = async (userData, token, shouldSetUser = true) => {
    try {
      if (token) {
      
        await AsyncStorage.setItem('token', token);
        await requestNotificationPermission();
        const fcmToken = await getFcmToken();

        if (fcmToken) {
          await fetch(`${API_URL}/notifications/save-fcm-token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
              'ngrok-skip-browser-warning': 'true',
            },
            body: JSON.stringify({ fcmToken })
          });
        }
      }

      if (shouldSetUser) {
        setUser(userData);
      }
    } catch (error) {
      console.log('Login error:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      setUser(null);
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  useEffect(() => {
 const restoreSession = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      const res = await fetch(ENDPOINTS.UPDATE_PROFILE, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true', }
      });

      const data = await res.json();

      if (res.ok) {
        if (data.user && data.user.username) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } else {
        await logout();
      }
    }
  } catch (e) {
    console.log('Session restore failed', e);
  } finally {
    setAuthLoading(false);
  }
};

    restoreSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, authLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};