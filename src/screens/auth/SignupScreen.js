import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, TextInput } from 'react-native';
import AuthButton from '../../components/AuthButton';
import auth from '@react-native-firebase/auth';

const SignupScreen = ({ navigation }) => {
const [phone, setPhone] = useState('');
const [email, setEmail] = useState('');
const [showPhoneInput, setShowPhoneInput] = useState(false); 

  const sendOtp = async () => {
    if (!phone) {
      alert("Please enter a phone number");
      return;
    }
    try {
      // Ensure phone number is in international format (e.g., +919999999999)
      const confirmation = await auth().signInWithPhoneNumber(phone);
      navigation.navigate('OtpVerify', { confirmation });
    } catch (error) {
      console.log("OTP Error: ", error);
      alert("Failed to send OTP. Check your number format.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Image
          source={require('../../assets/images/domato.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>
          The world's largest storytelling community
        </Text>
      </View>


      {/* Social Buttons */}
      <AuthButton title="Sign up with Google" icon={require('../../assets/images/google.png')} onPress={() => navigation.navigate('OtpVerify')} />
      <AuthButton title="Sign up with Facebook" icon={require('../../assets/images/facebook.png')} onPress={() => navigation.navigate('OtpVerify')} />
      {Platform.OS !== 'android' && (
        <AuthButton title="Sign up with Apple" icon={require('../../assets/images/apple.png')} onPress={() => navigation.navigate('OtpVerify')} />
      )}

      <Text style={styles.or}>or</Text>

      {showPhoneInput ? (
        <View>
          <TextInput
            placeholder="+91 00000 00000"
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <AuthButton
            title="Send OTP"
            filled
            onPress={sendOtp}
          />
          <TouchableOpacity onPress={() => setShowPhoneInput(false)}>
             <Text style={styles.cancelText}>Back</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <AuthButton
          title="Sign up with Phone"
          filled
          onPress={() => setShowPhoneInput(true)} // Toggle input visibility
        />
      )}

      {/* Email Signup */}
      {/* <AuthButton
        title="Sign up with email"
        filled
        onPress={() => sendOtp()}
      /> */}

      {/* Footer */}
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.footerText}>
          I already have an account
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',

  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain'
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
    // marginVertical: 20,
    fontWeight: '600',
    bottom: 30
  },
  or: {
    textAlign: 'center',
    marginVertical: 10,
    color: '#888'
  },
  footerText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 30,
    padding: 14,
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 16
  },
  cancelText: {
    textAlign: 'center',
    marginTop: 10,
    color: 'red'
  }
});
