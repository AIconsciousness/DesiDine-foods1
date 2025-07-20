import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ImageBackground, Image, Platform } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { apiRequest } from '../utils/api';

const LANGUAGES = {
  en: {
    login: 'Login',
    emailOrPhone: 'Email or Phone',
    password: 'Password',
    enterDetails: 'Please enter your details',
    switchToHindi: 'हिंदी में देखें',
    forgot: 'Forgot Password?',
    noAccount: 'No account? Sign up',
    error: 'Please fill all fields'
  },
  hi: {
    login: 'लॉगिन',
    emailOrPhone: 'ईमेल या फोन',
    password: 'पासवर्ड',
    enterDetails: 'कृपया अपनी जानकारी भरें',
    switchToHindi: 'View in English',
    forgot: 'पासवर्ड भूल गए?',
    noAccount: 'अकाउंट नहीं है? साइनअप करें',
    error: 'सभी फ़ील्ड भरें'
  }
};

// Local food image - using placeholder for now
const FOOD_IMAGE = { uri: 'https://via.placeholder.com/400x600/4CAF50/FFFFFF?text=DesiDine' };

export default function LoginScreen({ navigation }) {
  const [language, setLanguage] = useState('en');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const t = LANGUAGES[language];

  const handleLogin = async () => {
    setError('');
    if (!emailOrPhone || !password) {
      setError(t.error);
      return;
    }
    setLoading(true);
    try {
      await apiRequest('/auth/login', 'POST', { emailOrPhone, password, language });
      setLoading(false);
      navigation.navigate('Home');
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
          <Text style={styles.title}>{t.login}</Text>
          <Text style={styles.subtitle}>{t.enterDetails}</Text>
          <TextInput
            label={t.emailOrPhone}
            value={emailOrPhone}
            onChangeText={setEmailOrPhone}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="default"
            mode="outlined"
            theme={{ colors: { primary: '#388e3c' } }}
          />
          <TextInput
            label={t.password}
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
            mode="outlined"
            theme={{ colors: { primary: '#388e3c' } }}
          />
          {error ? <HelperText type="error">{error}</HelperText> : null}
          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            style={styles.button}
            contentStyle={{ paddingVertical: 6 }}
            labelStyle={{ fontWeight: 'bold', fontSize: 16 }}
            buttonColor="#43a047"
          >
            {t.login}
          </Button>
          <TouchableOpacity onPress={() => setLanguage(language === 'en' ? 'hi' : 'en')}>
            <Text style={styles.langSwitch}>{t.switchToHindi}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.link}>{t.forgot}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.link}>{t.noAccount}</Text>
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
  subtitle: {
    fontSize: 15,
    color: '#4caf50',
    marginBottom: 18,
    textAlign: 'center',
    fontWeight: '500',
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