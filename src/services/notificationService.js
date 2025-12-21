import messaging from '@react-native-firebase/messaging';
import { Alert, Platform } from 'react-native';

export const requestNotificationPermission = async () => {
  const authStatus = await messaging().requestPermission();

  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Notification permission enabled');
  } else {
    Alert.alert('Permission denied', 'Enable notifications from settings');
  }
};

export const getFcmToken = async () => {
  try {
    const token = await messaging().getToken();
    console.log('FCM Token:', token);
    return token;
  } catch (error) {
    console.log('FCM error:', error);
  }
};

export const listenForegroundNotifications = () => {
  return messaging().onMessage(async remoteMessage => {
    console.log('Foreground message:', remoteMessage);
  });
};
