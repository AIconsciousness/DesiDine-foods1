import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { apiRequest } from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SavedAddressesScreen({ navigation }) {
  const [addresses, setAddresses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newAddress, setNewAddress] = useState({
    type: 'Home',
    name: '',
    phone: '',
    address: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
  });

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        const response = await apiRequest('/address', 'GET', null, token);
        setAddresses(response || []);
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
      // For demo purposes, show some sample addresses
      setAddresses([
        {
          _id: '1',
          type: 'Home',
          name: 'John Doe',
          phone: '+91 98765 43210',
          address: '123 Main Street, Apartment 4B',
          landmark: 'Near Central Park',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          isDefault: true,
        },
        {
          _id: '2',
          type: 'Office',
          name: 'John Doe',
          phone: '+91 98765 43210',
          address: '456 Business Park, Floor 8',
          landmark: 'Opposite Metro Station',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400002',
          isDefault: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAddress = async () => {
    if (!newAddress.name || !newAddress.phone || !newAddress.address || !newAddress.city) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Error', 'Please login again');
        return;
      }

      const response = await apiRequest('/address', 'POST', {
        ...newAddress,
        isDefault: addresses.length === 0,
      }, token);

      if (response._id) {
        setAddresses([...addresses, response]);
        setNewAddress({
          type: 'Home',
          name: '',
          phone: '',
          address: '',
          landmark: '',
          city: '',
          state: '',
          pincode: '',
        });
        setShowAddForm(false);
        Alert.alert('Success', 'Address added successfully!');
      }
    } catch (error) {
      console.error('Error adding address:', error);
      Alert.alert('Error', error.message || 'Failed to add address');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              const token = await AsyncStorage.getItem('userToken');
              if (token) {
                await apiRequest(`/address/${id}`, 'DELETE', null, token);
                setAddresses(addresses.filter(addr => addr._id !== id));
                Alert.alert('Success', 'Address deleted successfully!');
              }
            } catch (error) {
              console.error('Error deleting address:', error);
              Alert.alert('Error', 'Failed to delete address');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleSetDefault = async (id) => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        await apiRequest(`/address/${id}/default`, 'PATCH', null, token);
        setAddresses(addresses.map(addr => ({
          ...addr,
          isDefault: addr._id === id,
        })));
      }
    } catch (error) {
      console.error('Error setting default address:', error);
      Alert.alert('Error', 'Failed to set default address');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditAddress = (address) => {
    navigation.navigate('EditAddress', { address });
  };

  const renderAddressCard = (address) => (
    <View key={address._id} style={styles.addressCard}>
      <View style={styles.addressHeader}>
        <View style={styles.addressTypeContainer}>
          <MaterialIcons 
            name={address.type === 'Home' ? 'home' : 'business'} 
            size={20} 
            color="#FF6B6B" 
          />
          <Text style={styles.addressType}>{address.type}</Text>
          {address.isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultText}>Default</Text>
            </View>
          )}
        </View>
        <View style={styles.addressActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEditAddress(address)}
          >
            <MaterialIcons name="edit" size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteAddress(address._id)}
          >
            <MaterialIcons name="delete" size={20} color="#FF5252" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.addressDetails}>
        <Text style={styles.addressName}>{address.name}</Text>
        <Text style={styles.addressPhone}>{address.phone}</Text>
        <Text style={styles.addressText}>{address.address}</Text>
        {address.landmark && (
          <Text style={styles.addressLandmark}>Landmark: {address.landmark}</Text>
        )}
        <Text style={styles.addressCity}>
          {address.city}, {address.state} - {address.pincode}
        </Text>
      </View>

      {!address.isDefault && (
        <TouchableOpacity
          style={styles.setDefaultButton}
          onPress={() => handleSetDefault(address._id)}
        >
          <Text style={styles.setDefaultText}>Set as Default</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderAddAddressForm = () => (
    <View style={styles.addFormCard}>
      <Text style={styles.formTitle}>Add New Address</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Address Type *</Text>
        <View style={styles.typeOptions}>
          {['Home', 'Office', 'Other'].map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeOption,
                newAddress.type === type && styles.selectedType
              ]}
              onPress={() => setNewAddress({ ...newAddress, type })}
            >
              <Text style={[
                styles.typeText,
                newAddress.type === type && styles.selectedTypeText
              ]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Full Name *</Text>
        <TextInput
          style={styles.textInput}
          value={newAddress.name}
          onChangeText={(text) => setNewAddress({ ...newAddress, name: text })}
          placeholder="Enter your full name"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Phone Number *</Text>
        <TextInput
          style={styles.textInput}
          value={newAddress.phone}
          onChangeText={(text) => setNewAddress({ ...newAddress, phone: text })}
          placeholder="Enter your phone number"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Address *</Text>
        <TextInput
          style={[styles.textInput, styles.textArea]}
          value={newAddress.address}
          onChangeText={(text) => setNewAddress({ ...newAddress, address: text })}
          placeholder="Enter your complete address"
          placeholderTextColor="#999"
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Landmark</Text>
        <TextInput
          style={styles.textInput}
          value={newAddress.landmark}
          onChangeText={(text) => setNewAddress({ ...newAddress, landmark: text })}
          placeholder="Nearby landmark (optional)"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
          <Text style={styles.inputLabel}>City *</Text>
          <TextInput
            style={styles.textInput}
            value={newAddress.city}
            onChangeText={(text) => setNewAddress({ ...newAddress, city: text })}
            placeholder="Enter city"
            placeholderTextColor="#999"
          />
        </View>
        <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
          <Text style={styles.inputLabel}>State *</Text>
          <TextInput
            style={styles.textInput}
            value={newAddress.state}
            onChangeText={(text) => setNewAddress({ ...newAddress, state: text })}
            placeholder="Enter state"
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Pincode *</Text>
        <TextInput
          style={styles.textInput}
          value={newAddress.pincode}
          onChangeText={(text) => setNewAddress({ ...newAddress, pincode: text })}
          placeholder="Enter pincode"
          placeholderTextColor="#999"
          keyboardType="numeric"
          maxLength={6}
        />
      </View>

      <View style={styles.formActions}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => setShowAddForm(false)}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
          onPress={handleAddAddress}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.saveButtonText}>Save Address</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
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
        <Text style={styles.headerTitle}>Saved Addresses</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddForm(!showAddForm)}
        >
          <MaterialIcons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {showAddForm && renderAddAddressForm()}
        
        {isLoading && addresses.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF6B6B" />
            <Text style={styles.loadingText}>Loading addresses...</Text>
          </View>
        ) : addresses.length > 0 ? (
          <View style={styles.addressesList}>
            {addresses.map(renderAddressCard)}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="location-off" size={80} color="#CCC" />
            <Text style={styles.emptyTitle}>No Saved Addresses</Text>
            <Text style={styles.emptySubtitle}>
              Add your delivery addresses to get started
            </Text>
            <TouchableOpacity
              style={styles.addFirstButton}
              onPress={() => setShowAddForm(true)}
            >
              <Text style={styles.addFirstButtonText}>Add Your First Address</Text>
            </TouchableOpacity>
          </View>
        )}
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
  addButton: {
    padding: 5,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
  },
  addFormCard: {
    backgroundColor: '#FFF',
    margin: 20,
    borderRadius: 15,
    padding: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#F8F9FA',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  typeOptions: {
    flexDirection: 'row',
    gap: 10,
  },
  typeOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  selectedType: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  typeText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectedTypeText: {
    color: '#FFF',
  },
  formActions: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    backgroundColor: '#FF6B6B',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
  },
  addressesList: {
    padding: 20,
  },
  addressCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  addressTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addressType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  defaultBadge: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '600',
  },
  addressActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    padding: 5,
  },
  addressDetails: {
    gap: 5,
  },
  addressName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  addressPhone: {
    fontSize: 14,
    color: '#666',
  },
  addressText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  addressLandmark: {
    fontSize: 14,
    color: '#666',
  },
  addressCity: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  setDefaultButton: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  setDefaultText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  addFirstButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
  },
  addFirstButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 