import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
  const checkAuth = async () => {
    const token = await AsyncStorage.getItem('token');

    setTimeout(() => {
      if (token) {
        navigation.replace('Home');
      } else {
        navigation.replace('Signup');
      }
    }, 2500);
  };
  checkAuth();
}, []);


  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require('../assets/images/logo.png')}
         style={styles.logo}
         resizeMode="contain"
      />

      {/* App Name */}
      <Text style={styles.title}>Domato Book Co.</Text>

      {/* Tagline (optional) */}
      <Text style={styles.subtitle}>
        Read • Subscribe • Enjoy
      </Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    width: 120,
    height: 120,  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000'
  },
  subtitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
    color: '#000'
  }
});
