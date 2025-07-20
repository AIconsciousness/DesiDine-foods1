import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ImageBackground, Platform } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { apiRequest } from '../utils/api';

const LANGUAGES = {
  en: {
    forgot: 'Forgot Password',
    phone: 'Phone',
    sendOtp: 'Send OTP',
    switchToHindi: 'हिंदी में देखें',
    error: 'Please enter your phone number',
    success: 'OTP sent! Please check your phone.'
  },
  hi: {
    forgot: 'पासवर्ड भूल गए',
    phone: 'फोन',
    sendOtp: 'OTP भेजें',
    switchToHindi: 'View in English',
    error: 'कृपया अपना फोन नंबर डालें',
    success: 'OTP भेज दिया गया! कृपया अपना फोन देखें।'
  }
};

// Local food image - using placeholder for now
const FOOD_IMAGE = { uri: 'https://via.placeholder.com/400x600/4CAF50/FFFFFF?text=DesiDine' };

export default function ForgotPasswordScreen({ navigation }) {
  const [language, setLanguage] = useState('en');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const t = LANGUAGES[language];

  const handleSendOtp = async () => {
    setError('');
    setSuccess('');
    if (!phone) {
      setError(t.error);
      return;
    }
    setLoading(true);
    try {
      await apiRequest('/auth/forgot-password', 'POST', { phone, language });
      setLoading(false);
      setSuccess(t.success);
      setTimeout(() => navigation.navigate('ResetPassword', { phone, language }), 1500);
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <ImageBackground
      source={FOOD_IMAGE}
      style={styles.bg}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["rgba(168,224,99,0.85)", "rgba(86,171,47,0.85)"]}
        style={styles.gradient}
      >
        <View style={styles.card}>
          <Text style={styles.title}>{t.forgot}</Text>
          <TextInput
            label={t.phone}
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
            keyboardType="phone-pad"
            mode="outlined"
            theme={{ colors: { primary: '#388e3c' } }}
          />
          {error ? <HelperText type="error">{error}</HelperText> : null}
          {success ? <HelperText type="info" visible={true}>{success}</HelperText> : null}
          <Button
            mode="contained"
            onPress={handleSendOtp}
            loading={loading}
            style={styles.button}
            contentStyle={{ paddingVertical: 6 }}
            labelStyle={{ fontWeight: 'bold', fontSize: 16 }}
            buttonColor="#43a047"
          >
            {t.sendOtp}
          </Button>
          <TouchableOpacity onPress={() => setLanguage(language === 'en' ? 'hi' : 'en')}>
            <Text style={styles.langSwitch}>{t.switchToHindi}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: 24,
    padding: 24,
    marginBottom: 30,
    shadowColor: '#388e3c',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
    alignSelf: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#388e3c',
    marginBottom: 8,
    textAlign: 'center',
  },
  input: {
    marginBottom: 14,
    backgroundColor: '#f1f8e9',
    borderRadius: 10,
  },
  button: {
    marginVertical: 12,
    borderRadius: 10,
    shadowColor: '#388e3c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  langSwitch: {
    color: '#388e3c',
    textAlign: 'center',
    marginVertical: 8,
    fontWeight: 'bold',
    fontSize: 15,
  },
  link: {
    color: '#007bff',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: 'bold',
    fontSize: 15,
  },
}); 