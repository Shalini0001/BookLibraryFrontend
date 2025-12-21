import React, { useContext, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image } from 'react-native';
import AuthButton from '../../components/AuthButton';
import { AuthContext } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { ENDPOINTS } from '../../utils/constants';

const OTPVerificationScreen = ({ route }) => {
  const navigation = useNavigation();
  const [otp, setOtp] = useState('');
  const { login } = useContext(AuthContext);
  const { confirmation } = route.params;

const verifyOtp = async () => {
  try {
    // 1. Firebase Verification
    const result = await confirmation.confirm(otp);
    const firebaseUser = result.user;

    // 2. Backend Sync
    const res = await fetch(ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firebaseUid: firebaseUser.uid })
    }).catch(err => {
      // This catches the "Network Request Failed"
      throw new Error("SERVER_NETWORK_ERROR");
    });

    if (!res.ok) {
       const errorData = await res.json();
       alert(errorData.message || "Backend Error");
       return;
    }

    const { token } = await res.json();
    login({ uid: firebaseUser.uid }, token);
    navigation.navigate('RegisterUser');

  } catch (err) {
    if (err.message === "SERVER_NETWORK_ERROR") {
      alert("Cannot connect to server. Please check if backend is running.");
    } else {
      alert('Invalid OTP code');
    }
  }
};

  return (
    <View style={styles.container}>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Image
          source={require('../../assets/images/domato.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.title}>Verify OTP</Text>
      <Text style={styles.subTitle}>
        Enter the OTP sent to your email/mobile
      </Text>

      <TextInput
        placeholder="Enter OTP"
        keyboardType="number-pad"
        maxLength={6}
        value={otp}
        onChangeText={setOtp}
        style={styles.otpInput}
      />

      <AuthButton title="Verify & Continue" filled onPress={verifyOtp} />
    </View>
  );
};

export default OTPVerificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  subTitle: {
    textAlign: 'center',
    marginVertical: 10,
    color: '#666'
  },
  otpInput: {
    borderWidth: 1,
    borderRadius: 30,
    padding: 16,
    textAlign: 'center',
    fontSize: 18,
    letterSpacing: 6,
    marginVertical: 20
  }
});
