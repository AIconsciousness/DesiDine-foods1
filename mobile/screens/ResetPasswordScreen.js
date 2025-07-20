import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text as RNText } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { apiRequest } from '../utils/api';

const LANGUAGES = {
  en: {
    reset: 'Reset Password',
    phone: 'Phone',
    otp: 'Enter OTP',
    newPassword: 'New Password',
    switchToHindi: 'हिंदी में देखें',
    error: 'Please fill all fields',
    success: 'Password reset! Please login.'
  },
  hi: {
    reset: 'पासवर्ड रीसेट करें',
    phone: 'फोन',
    otp: 'OTP डालें',
    newPassword: 'नया पासवर्ड',
    switchToHindi: 'View in English',
    error: 'सभी फ़ील्ड भरें',
    success: 'पासवर्ड रीसेट हो गया! कृपया लॉगिन करें।'
  }
};

export default function ResetPasswordScreen({ navigation, route }) {
  const [language, setLanguage] = useState(route?.params?.language || 'en');
  const [phone, setPhone] = useState(route?.params?.phone || '');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const t = LANGUAGES[language];

  const handleReset = async () => {
    setError('');
    setSuccess('');
    if (!phone || !otp || !newPassword) {
      setError(t.error);
      return;
    }
    setLoading(true);
    try {
      await apiRequest('/auth/reset-password', 'POST', { phone, otp, newPassword, language });
      setLoading(false);
      setSuccess(t.success);
      setTimeout(() => navigation.navigate('Login'), 1500);
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.reset}</Text>
      <TextInput
        label={t.phone}
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
        keyboardType="phone-pad"
      />
      <TextInput
        label={t.otp}
        value={otp}
        onChangeText={setOtp}
        style={styles.input}
        keyboardType="number-pad"
      />
      <TextInput
        label={t.newPassword}
        value={newPassword}
        onChangeText={setNewPassword}
        style={styles.input}
        secureTextEntry
      />
      {error ? <HelperText type="error">{error}</HelperText> : null}
      {success ? <HelperText type="info" visible={true}>{success}</HelperText> : null}
      <Button mode="contained" onPress={handleReset} loading={loading} style={styles.button}>
        {t.reset}
      </Button>
      <TouchableOpacity onPress={() => setLanguage(language === 'en' ? 'hi' : 'en')}>
        <RNText style={styles.langSwitch}>{t.switchToHindi}</RNText>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <RNText style={styles.link}>Back to Login</RNText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginVertical: 12,
  },
  langSwitch: {
    color: '#007bff',
    textAlign: 'center',
    marginVertical: 8,
    fontWeight: 'bold',
  },
  link: {
    color: '#007bff',
    textAlign: 'center',
    marginTop: 8,
  },
}); 