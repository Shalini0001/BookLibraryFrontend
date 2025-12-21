import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useEffect, useState } from 'react';
import { requestNotificationPermission, getFcmToken } from '../services/notificationService';
import { API_URL, ENDPOINTS } from '../utils/constants';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Function to Login (called from Login/OTP screens)
  const login = async (userData, token) => {
    try {
      if (token) {
        await AsyncStorage.setItem('token', token);

        // Handle Notifications
        await requestNotificationPermission();
        const fcmToken = await getFcmToken();

        if (fcmToken) {
          await fetch(`${API_URL}/notifications/save-token`, { // Ensure this matches your backend route
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ fcmToken })
          });
        }
      }
      setUser(userData);
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

  // Check if user is already logged in when app opens
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          // Fetch the real user profile from backend
          const res = await fetch(`${API_URL}/user/profile`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` }
          });

          const data = await res.json();

          if (res.ok) {
            // Set the actual user data (username, email, etc.)
            setUser(data.user);
          } else {
            // Token expired or user deleted
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