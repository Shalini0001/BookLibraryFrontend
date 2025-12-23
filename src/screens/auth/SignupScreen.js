import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, Alert } from 'react-native';
import AuthButton from '../../components/AuthButton';
import auth from '@react-native-firebase/auth';
import PhoneInput from "react-native-phone-number-input";

const SignupScreen = ({ navigation }) => {
  const [value, setValue] = useState("");
  const [formattedValue, setFormattedValue] = useState("");
  const [showPhoneInput, setShowPhoneInput] = useState(false);
  const phoneInput = useRef(null);

  const sendOtp = async () => {

    const checkValid = phoneInput.current?.isValidNumber(value);

    if (!value || !checkValid) {
      Alert.alert("Please enter a valid phone number with country code");
      return;
    }

    try {
      const confirmation = await auth().signInWithPhoneNumber(formattedValue);
      navigation.navigate('OtpVerify', { confirmation, flow: 'signup' });
    } catch (error) {
      Alert.alert("Failed to send OTP");
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
        <Text style={styles.title}>
          The world's largest storytelling community
        </Text>
      </View>

      {/* <AuthButton title="Sign up with Google" icon={require('../../assets/images/google.png')} />
      <AuthButton title="Sign up with Facebook" icon={require('../../assets/images/facebook.png')} />
      
      {Platform.OS !== 'android' && (
        <AuthButton title="Sign up with Apple" icon={require('../../assets/images/apple.png')} />
      )} */}

      {/* <Text style={styles.or}>or</Text> */}

      {/* {showPhoneInput ? (
        <View style={styles.inputWrapper}>
          <PhoneInput
            ref={phoneInput}
            defaultValue={value}
            defaultCode="IN" 
            layout="first"
            onChangeText={(text) => setValue(text)}
            onChangeFormattedText={(text) => setFormattedValue(text)}
            
            withShadow
            autoFocus
            containerStyle={styles.phoneContainer}
            textContainerStyle={styles.textInputContainer}
          />
          
          <View style={{ marginTop: 20, width: '100%', }}>
            <AuthButton
              title="Send OTP"
              filled
              onPress={sendOtp}
            />
          </View>

          <TouchableOpacity onPress={() => setShowPhoneInput(false)}>
            <Text style={styles.cancelText}>Back</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <AuthButton
          title="Sign up with Phone"
          filled
          onPress={() => setShowPhoneInput(true)}
        />
      )} */}

      <View style={styles.inputWrapper}>
        <PhoneInput
          ref={phoneInput}
          defaultValue={value}
          defaultCode="IN"
          layout='second'
          onChangeText={setValue}
          onChangeFormattedText={setFormattedValue}
          withShadow={false}
          autoFocus={false}


          withDarkTheme={false}
          withEmoji={true}
          filterProps={{ autoFocus: true }}

          containerStyle={styles.phoneContainer}
          textContainerStyle={styles.textInputContainer}
          flagButtonStyle={styles.flagButton}
          codeTextStyle={styles.codeText}
        />
        <View style={{ marginTop: 20, width: '100%', }}>
          <AuthButton
            title="SignUp with Phone"
            filled
            onPress={sendOtp}
          />
        </View>

      </View>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.footerText}>
          I already have an account! <Text style={styles.signInLink}>Sign in</Text>
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

  inputWrapper: {
    width: '100%',
    alignItems: 'center'
  },

  phoneContainer: {
    width: '100%',
    height: 60,
    backgroundColor: '#fff', borderRadius: 30,
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

  cancelText: {
    textAlign: 'center',
    marginTop: 15,
    color: 'red',
    fontWeight: '600'
  },
  signInLink: {
    fontWeight: 'bold',
    color: '#000'
  }
});