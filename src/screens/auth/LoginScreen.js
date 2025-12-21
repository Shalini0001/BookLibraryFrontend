import React, { useContext, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import AuthButton from '../../components/AuthButton';
import auth from '@react-native-firebase/auth';
import { AuthContext } from '../../context/AuthContext';
import { ENDPOINTS } from '../../utils/constants';

const LoginScreen = ({ navigation }) => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onLogin = async () => {
    const userCredential =
    await auth().signInWithEmailAndPassword(email, password);
    const firebaseUser = userCredential.user;

    const res = await fetch(ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firebaseUid: firebaseUser.uid })
    });

    const { token } = await res.json();
    login({ email: firebaseUser.email }, token);

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
      {/* Social Login */}
      <AuthButton title="Sign up with Google" icon={require('../../assets/images/google.png')} />
      <AuthButton title="Sign up with Facebook" icon={require('../../assets/images/facebook.png')} />
      {Platform.OS !== 'android' && (
        <AuthButton title="Sign up with Apple" icon={require('../../assets/images/apple.png')} onPress={() => navigation.navigate('OtpVerify')} />
      )}

      <Text style={styles.or}>or</Text>

      {/* Inputs */}
      <TextInput
        placeholder="Email or username"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      {/* Login */}
      <AuthButton title="Sign in" filled onPress={onLogin} />

      <TouchableOpacity>
        <Text style={styles.link}>Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.footerText}>
          Don't have an account? Sign up
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
    backgroundColor: '#fff'
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain'
  },
  or: {
    textAlign: 'center',
    marginVertical: 10,
    color: '#888'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 30,
    padding: 14,
    marginVertical: 8
  },
  link: {
    textAlign: 'center',
    marginVertical: 10
  },
  footerText: {
    textAlign: 'center',
    marginTop: 20
  }
});
