import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignupScreen from '../screens/auth/SignupScreen';
import OTPVerificationScreen from '../screens/auth/OTPVerificationScreen'
import LoginScreen from '../screens/auth/LoginScreen';
import SplashScreen from '../screens/SplashScreen';
import RegisterUserScreen from '../screens/auth/RegisterUserScreen';
import { AuthContext } from '../context/AuthContext';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
const { authLoading, user } = useContext(AuthContext);
return (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    {authLoading ? (
      <Stack.Screen name="Splash" component={SplashScreen} />
    ) : user ? (
      <Stack.Screen name="Home" component={HomeScreen} />
    ) : (
      <>
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="OtpVerify" component={OTPVerificationScreen} />
        <Stack.Screen name="RegisterUser" component={RegisterUserScreen} />
      </>
    )}
  </Stack.Navigator>
);
}
