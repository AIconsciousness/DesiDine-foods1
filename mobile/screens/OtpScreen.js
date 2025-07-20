import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text as RNText } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { apiRequest } from '../utils/api';

const LANGUAGES = {
  en: {
    verify: 'Verify OTP',
    phone: 'Phone',
    otp: 'Enter OTP',
    resend: 'Resend OTP',
    switchToHindi: 'हिंदी में देखें',
    error: 'Please fill all fields',
    success: 'OTP verified! Please login.'
  },
  hi: {
    verify: 'OTP वेरीफाई करें',
    phone: 'फोन',
    otp: 'OTP डालें',
    resend: 'OTP फिर से भेजें',
    switchToHindi: 'View in English',
    error: 'सभी फ़ील्ड भरें',
    success: 'OTP वेरीफाई हो गया! कृपया लॉगिन करें।'
  }
};

export default function OtpScreen({ navigation, route }) {
  const [language, setLanguage] = useState(route?.params?.language || 'en');
  const [phone, setPhone] = useState(route?.params?.phone || '');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const t = LANGUAGES[language];

  const handleVerify = async () => {
    setError('');
    setSuccess('');
    if (!phone || !otp) {
      setError(t.error);
      return;
    }
    setLoading(true);
    try {
      await apiRequest('/auth/verify-otp', 'POST', { phone, otp, language });
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
      <Text style={styles.title}>{t.verify}</Text>
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
      {error ? <HelperText type="error">{error}</HelperText> : null}
      {success ? <HelperText type="info" visible={true}>{success}</HelperText> : null}
      <Button mode="contained" onPress={handleVerify} loading={loading} style={styles.button}>
        {t.verify}
      </Button>
      <TouchableOpacity onPress={() => setLanguage(language === 'en' ? 'hi' : 'en')}>
        <RNText style={styles.langSwitch}>{t.switchToHindi}</RNText>
      </TouchableOpacity>
      <TouchableOpacity>
        <RNText style={styles.link}>{t.resend}</RNText>
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