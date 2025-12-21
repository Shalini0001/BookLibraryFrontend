import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Image } from 'react-native';

const AuthButton = ({ title, icon, filled = false, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.button, filled && styles.filled]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.row}>
        {icon && <Image style={styles.icon} source={icon} />}
        <Text style={[styles.text, filled && styles.filledText]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default AuthButton;

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 30,
    paddingVertical: 14,
    marginVertical: 8
  },
  filled: {
    backgroundColor: '#000'
  },
  text: {
    fontSize: 16,
    textAlign: 'center'
  },
  filledText: {
    color: '#fff',
    fontWeight: '600'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    // marginRight: 8
    height: 20,
    width: 20,
    marginRight: 10,
    resizeMode: 'contain'
  }
});
