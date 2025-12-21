import React from 'react';
import { createNativeStackNavigator  } from '@react-navigation/native-stack';
import HomeScreen from '../screens/home/HomeScreen';
import BookDetailsScreen from '../screens/home/BookDetailsScreen';
import PaymentScreen from '../screens/payment/PaymentScreen';

const Stack = createNativeStackNavigator ();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="BookDetail" component={BookDetailsScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
    </Stack.Navigator>
  );
}
