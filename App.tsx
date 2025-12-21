import React, { useEffect } from 'react';
import { AuthProvider } from './src/context/AuthContext';
import { SubscriptionProvider } from './src/context/SubscriptionContext';
import RootNavigator from './src/navigations/RootNavigator';
import { listenForegroundNotifications } from './src/services/notificationService';

export default function App() {

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
