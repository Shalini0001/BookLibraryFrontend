import React, { useContext, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image , Alert} from 'react-native';
import AuthButton from '../../components/AuthButton';
import { AuthContext } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { ENDPOINTS } from '../../utils/constants';

const OTPVerificationScreen = ({ route }) => {
  const navigation = useNavigation();
  const [otp, setOtp] = useState('');
  const { login } = useContext(AuthContext);
  const { confirmation, flow } = route.params;

const verifyOtp = async () => {
  try {
    const result = await confirmation.confirm(otp);
    const firebaseUser = result.user;

    const res = await fetch(ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
       },
      body: JSON.stringify({ 
        firebaseUid: firebaseUser.uid,
        phone: firebaseUser.phoneNumber,
        flow: flow
      })
    });

    const data = await res.json();

    if (res.ok) {
      if (data.isNewUser === false) {
        if (flow === 'signup') {
            Alert.alert(
              "Already Registered", 
              "This number is already registered. Please go to the Login screen.",
              [{ text: "Go to Login", onPress: () => navigation.navigate('Login') }]
            );
            return;
        }

        login(data.user, data.token, true); 
      } else {
        await login({ uid: firebaseUser.uid }, data.token, false); 
        navigation.replace('RegisterUser'); 
      }
    } else {
      console.log("Login Failed:", data.message);
    }
  } catch (err) {
    Alert.alert("Error", "Invalid OTP");
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
        Enter the OTP sent to your mobile
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
