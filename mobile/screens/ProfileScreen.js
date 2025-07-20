import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

export default function ProfileScreen({ navigation }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);

  const userInfo = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 98765 43210',
    avatar: 'https://via.placeholder.com/100/FF6B6B/FFFFFF?text=JD',
  };

  const profileOptions = [
    {
      id: 'personal',
      title: 'Personal Information',
      icon: 'person',
      onPress: () => navigation.navigate('EditProfile'),
    },
    {
      id: 'addresses',
      title: 'Saved Addresses',
      icon: 'location-on',
      onPress: () => navigation.navigate('SavedAddresses'),
    },
    {
      id: 'payments',
      title: 'Payment Methods',
      icon: 'credit-card',
      onPress: () => navigation.navigate('PaymentMethods'),
    },
    {
      id: 'favorites',
      title: 'Favorite Restaurants',
      icon: 'favorite',
      onPress: () => navigation.navigate('FavoriteRestaurants'),
    },
  ];

  const settingsOptions = [
    {
      id: 'notifications',
      title: 'Push Notifications',
      icon: 'notifications',
      type: 'switch',
      value: notificationsEnabled,
      onValueChange: setNotificationsEnabled,
    },
    {
      id: 'location',
      title: 'Location Services',
      icon: 'my-location',
      type: 'switch',
      value: locationEnabled,
      onValueChange: setLocationEnabled,
    },
    {
      id: 'language',
      title: 'Language',
      icon: 'language',
      subtitle: 'English',
      onPress: () => navigation.navigate('LanguageSettings'),
    },
    {
      id: 'currency',
      title: 'Currency',
      icon: 'attach-money',
      subtitle: 'INR (₹)',
      onPress: () => navigation.navigate('CurrencySettings'),
    },
  ];

  const supportOptions = [
    {
      id: 'help',
      title: 'Help & Support',
      icon: 'help',
      onPress: () => navigation.navigate('HelpSupport'),
    },
    {
      id: 'feedback',
      title: 'Send Feedback',
      icon: 'feedback',
      onPress: () => navigation.navigate('Feedback'),
    },
    {
      id: 'about',
      title: 'About DesiDine',
      icon: 'info',
      onPress: () => navigation.navigate('About'),
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      icon: 'security',
      onPress: () => navigation.navigate('PrivacyPolicy'),
    },
    {
      id: 'terms',
      title: 'Terms of Service',
      icon: 'description',
      onPress: () => navigation.navigate('TermsOfService'),
    },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            // Handle logout logic here
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ]
    );
  };

  const renderOptionItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.optionItem}
      onPress={item.onPress}
      disabled={item.type === 'switch'}
    >
      <View style={styles.optionLeft}>
        <MaterialIcons name={item.icon} size={24} color="#666" />
        <View style={styles.optionInfo}>
          <Text style={styles.optionTitle}>{item.title}</Text>
          {item.subtitle && (
            <Text style={styles.optionSubtitle}>{item.subtitle}</Text>
          )}
        </View>
      </View>
      {item.type === 'switch' ? (
        <Switch
          value={item.value}
          onValueChange={item.onValueChange}
          trackColor={{ false: '#E0E0E0', true: '#FF6B6B' }}
          thumbColor={item.value ? '#FFF' : '#FFF'}
        />
      ) : (
        <MaterialIcons name="chevron-right" size={24} color="#666" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <MaterialIcons name="edit" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* User Info Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {userInfo.name.split(' ').map(name => name[0]).join('')}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userInfo.name}</Text>
            <Text style={styles.userEmail}>{userInfo.email}</Text>
            <Text style={styles.userPhone}>{userInfo.phone}</Text>
          </View>
        </View>

        {/* Profile Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.optionsCard}>
            {profileOptions.map(renderOptionItem)}
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.optionsCard}>
            {settingsOptions.map(renderOptionItem)}
          </View>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.optionsCard}>
            {supportOptions.map(renderOptionItem)}
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <MaterialIcons name="logout" size={24} color="#FF5252" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>DesiDine v1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#FF6B6B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  editButton: {
    padding: 5,
  },
  content: {
    flex: 1,
  },
  userCard: {
    backgroundColor: '#FFF',
    margin: 20,
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  avatarText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  optionsCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionInfo: {
    marginLeft: 15,
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  logoutButton: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 15,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF5252',
    marginLeft: 10,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 12,
    color: '#999',
  },
}); 