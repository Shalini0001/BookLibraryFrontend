import React, { useEffect } from 'react';
import { AuthProvider } from './src/context/AuthContext';
import { SubscriptionProvider } from './src/context/SubscriptionContext';
import RootNavigator from './src/navigations/RootNavigator';
import { getFcmToken, listenForegroundNotifications, requestNotificationPermission } from './src/services/notificationService';

export default function App() {

  useEffect(() => {
  const setupNotifications = async () => {
    const hasPermission = await requestNotificationPermission();
    if (hasPermission) {
      const token = await getFcmToken();
    }
  };

  setupNotifications();

  const unsubscribe = listenForegroundNotifications();

  return () => unsubscribe();
}, []);

  useEffect(() => {
    const unsubscribe = listenForegroundNotifications();
    return unsubscribe;
  }, []);

  return (
    <AuthProvider>
      <SubscriptionProvider>
        <RootNavigator />
      </SubscriptionProvider>
    </AuthProvider>
  );
}
