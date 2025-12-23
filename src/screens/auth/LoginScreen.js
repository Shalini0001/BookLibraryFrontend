import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import AuthButton from '../../components/AuthButton';
import auth from '@react-native-firebase/auth';
import PhoneInput from "react-native-phone-number-input";

const LoginScreen = ({ navigation }) => {
  const [value, setValue] = useState(""); 
  const [formattedValue, setFormattedValue] = useState(""); 
  const phoneInput = useRef(null);

  const handleLogin = async () => {
    const checkValid = phoneInput.current?.isValidNumber(value);

    if (!value || !checkValid) {
      alert("Please enter a valid phone number");
      return;
    }

    try {
      const confirmation = await auth().signInWithPhoneNumber(formattedValue);
      navigation.navigate('OtpVerify', { confirmation });
    } catch (error) {
      console.log("Login Error: ", error);
      alert("Failed to send code. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo Section */}
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

      {/* Social Login Section */}
      {/* <AuthButton title="Continue with Google" icon={require('../../assets/images/google.png')} />
      <AuthButton title="Continue with Facebook" icon={require('../../assets/images/facebook.png')} />
      
      {Platform.OS !== 'android' && (
        <AuthButton title="Continue with Apple" icon={require('../../assets/images/apple.png')} />
      )} */}

      {/* <Text style={styles.or}>or</Text> */}

      {/* Phone Input Section */}
      <View style={styles.inputWrapper}>
        <PhoneInput
          ref={phoneInput}
          defaultValue={value}
          defaultCode="IN"
          layout='second'
          onChangeText={(text) => setValue(text)}
          onChangeFormattedText={(text) => setFormattedValue(text)}

          withShadow
          autoFocus={false}
          withDarkTheme={false}
          withEmoji={true}
          filterProps={{ autoFocus: true }}

          containerStyle={styles.phoneContainer}
          textContainerStyle={styles.textInputContainer}
          flagButtonStyle={styles.flagButton}
          codeTextStyle={styles.codeText}
        />

        <View style={styles.buttonSpacer}>
          <AuthButton
            title="Next"
            filled
            onPress={handleLogin}
          />
        </View>
      </View>

      {/* Footer */}
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.footerText}>
          Don't have an account? <Text style={styles.signUpLink}>Sign up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center'
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40
  },
  logo: {
    width: 150,
    height: 150,
  },
  or: {
    textAlign: 'center',
    marginVertical: 20,
    color: '#888',
    fontSize: 14,
  },
  inputWrapper: {
    width: '100%',
  },
  phoneContainer: {
    width: '100%',
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 30, 
    borderWidth: 1,
    borderColor: '#ccc',
    overflow: 'hidden',
  },

  textInputContainer: {
    backgroundColor: '#fff',
    paddingVertical: 0,
    borderLeftWidth: 1,
    borderLeftColor: '#eee',
  },

  flagButton: {
    backgroundColor: '#fff',
  },

  codeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
    bottom: 30
  },
  textInput: {
    fontSize: 16,
    height: 50,
  },
  buttonSpacer: {
    marginTop: 20
  },
  footerText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 15,
    color: '#444'
  },
  signUpLink: {
    fontWeight: 'bold',
    color: '#000'
  }
});