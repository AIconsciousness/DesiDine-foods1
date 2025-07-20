import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

export default function PaymentMethodsScreen({ navigation }) {
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: '1',
      type: 'card',
      name: 'HDFC Credit Card',
      number: '**** **** **** 1234',
      expiry: '12/25',
      isDefault: true,
      cardType: 'visa',
    },
    {
      id: '2',
      type: 'card',
      name: 'SBI Debit Card',
      number: '**** **** **** 5678',
      expiry: '09/26',
      isDefault: false,
      cardType: 'mastercard',
    },
    {
      id: '3',
      type: 'upi',
      name: 'UPI ID',
      number: 'john.doe@okicici',
      isDefault: false,
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedType, setSelectedType] = useState('card');
  const [newPayment, setNewPayment] = useState({
    type: 'card',
    name: '',
    number: '',
    expiry: '',
    cvv: '',
    upiId: '',
  });

  const handleAddPayment = () => {
    if (selectedType === 'card') {
      if (!newPayment.name || !newPayment.number || !newPayment.expiry || !newPayment.cvv) {
        Alert.alert('Error', 'Please fill all required fields');
        return;
      }
    } else {
      if (!newPayment.upiId) {
        Alert.alert('Error', 'Please enter UPI ID');
        return;
      }
    }

    const payment = {
      id: Date.now().toString(),
      type: selectedType,
      name: selectedType === 'card' ? newPayment.name : 'UPI ID',
      number: selectedType === 'card' ? `**** **** **** ${newPayment.number.slice(-4)}` : newPayment.upiId,
      expiry: selectedType === 'card' ? newPayment.expiry : null,
      isDefault: paymentMethods.length === 0,
      cardType: selectedType === 'card' ? 'visa' : null,
    };

    setPaymentMethods([...paymentMethods, payment]);
    setNewPayment({
      type: 'card',
      name: '',
      number: '',
      expiry: '',
      cvv: '',
      upiId: '',
    });
    setShowAddForm(false);
    Alert.alert('Success', 'Payment method added successfully!');
  };

  const handleDeletePayment = (id) => {
    Alert.alert(
      'Delete Payment Method',
      'Are you sure you want to delete this payment method?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setPaymentMethods(paymentMethods.filter(payment => payment.id !== id));
          },
        },
      ]
    );
  };

  const handleSetDefault = (id) => {
    setPaymentMethods(paymentMethods.map(payment => ({
      ...payment,
      isDefault: payment.id === id,
    })));
  };

  const getCardIcon = (cardType) => {
    switch (cardType) {
      case 'visa': return 'credit-card';
      case 'mastercard': return 'credit-card';
      default: return 'credit-card';
    }
  };

  const renderPaymentCard = (payment) => (
    <View key={payment.id} style={styles.paymentCard}>
      <View style={styles.paymentHeader}>
        <View style={styles.paymentInfo}>
          <MaterialIcons 
            name={payment.type === 'card' ? getCardIcon(payment.cardType) : 'account-balance-wallet'} 
            size={24} 
            color="#FF6B6B" 
          />
          <View style={styles.paymentDetails}>
            <Text style={styles.paymentName}>{payment.name}</Text>
            <Text style={styles.paymentNumber}>{payment.number}</Text>
            {payment.expiry && (
              <Text style={styles.paymentExpiry}>Expires: {payment.expiry}</Text>
            )}
          </View>
        </View>
        <View style={styles.paymentActions}>
          {payment.isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultText}>Default</Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeletePayment(payment.id)}
          >
            <MaterialIcons name="delete" size={20} color="#FF5252" />
          </TouchableOpacity>
        </View>
      </View>

      {!payment.isDefault && (
        <TouchableOpacity
          style={styles.setDefaultButton}
          onPress={() => handleSetDefault(payment.id)}
        >
          <Text style={styles.setDefaultText}>Set as Default</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderAddPaymentForm = () => (
    <View style={styles.addFormCard}>
      <Text style={styles.formTitle}>Add Payment Method</Text>
      
      <View style={styles.paymentTypeSelector}>
        <TouchableOpacity
          style={[
            styles.typeOption,
            selectedType === 'card' && styles.selectedType
          ]}
          onPress={() => setSelectedType('card')}
        >
          <MaterialIcons name="credit-card" size={24} color={selectedType === 'card' ? '#FFF' : '#666'} />
          <Text style={[
            styles.typeText,
            selectedType === 'card' && styles.selectedTypeText
          ]}>
            Credit/Debit Card
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.typeOption,
            selectedType === 'upi' && styles.selectedType
          ]}
          onPress={() => setSelectedType('upi')}
        >
          <MaterialIcons name="account-balance-wallet" size={24} color={selectedType === 'upi' ? '#FFF' : '#666'} />
          <Text style={[
            styles.typeText,
            selectedType === 'upi' && styles.selectedTypeText
          ]}>
            UPI
          </Text>
        </TouchableOpacity>
      </View>

      {selectedType === 'card' ? (
        <>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Card Holder Name *</Text>
            <TextInput
              style={styles.textInput}
              value={newPayment.name}
              onChangeText={(text) => setNewPayment({ ...newPayment, name: text })}
              placeholder="Enter card holder name"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Card Number *</Text>
            <TextInput
              style={styles.textInput}
              value={newPayment.number}
              onChangeText={(text) => setNewPayment({ ...newPayment, number: text })}
              placeholder="1234 5678 9012 3456"
              placeholderTextColor="#999"
              keyboardType="numeric"
              maxLength={19}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.inputLabel}>Expiry Date *</Text>
              <TextInput
                style={styles.textInput}
                value={newPayment.expiry}
                onChangeText={(text) => setNewPayment({ ...newPayment, expiry: text })}
                placeholder="MM/YY"
                placeholderTextColor="#999"
                maxLength={5}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
              <Text style={styles.inputLabel}>CVV *</Text>
              <TextInput
                style={styles.textInput}
                value={newPayment.cvv}
                onChangeText={(text) => setNewPayment({ ...newPayment, cvv: text })}
                placeholder="123"
                placeholderTextColor="#999"
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
              />
            </View>
          </View>
        </>
      ) : (
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>UPI ID *</Text>
          <TextInput
            style={styles.textInput}
            value={newPayment.upiId}
            onChangeText={(text) => setNewPayment({ ...newPayment, upiId: text })}
            placeholder="username@upi"
            placeholderTextColor="#999"
            autoCapitalize="none"
          />
        </View>
      )}

      <View style={styles.formActions}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => setShowAddForm(false)}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleAddPayment}
        >
          <Text style={styles.saveButtonText}>Add Payment Method</Text>
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
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddForm(!showAddForm)}
        >
          <MaterialIcons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {showAddForm && renderAddPaymentForm()}
        
        {paymentMethods.length > 0 ? (
          <View style={styles.paymentMethodsList}>
            {paymentMethods.map(renderPaymentCard)}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="credit-card-off" size={80} color="#CCC" />
            <Text style={styles.emptyTitle}>No Payment Methods</Text>
            <Text style={styles.emptySubtitle}>
              Add your payment methods to get started
            </Text>
            <TouchableOpacity
              style={styles.addFirstButton}
              onPress={() => setShowAddForm(true)}
            >
              <Text style={styles.addFirstButtonText}>Add Payment Method</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Security Note */}
        <View style={styles.securityNote}>
          <MaterialIcons name="security" size={20} color="#4CAF50" />
          <Text style={styles.securityText}>
            Your payment information is encrypted and secure
          </Text>
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
  addButton: {
    padding: 5,
  },
  content: {
    flex: 1,
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
  paymentTypeSelector: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  typeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
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
  row: {
    flexDirection: 'row',
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
  saveButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
  },
  paymentMethodsList: {
    padding: 20,
  },
  paymentCard: {
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
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentDetails: {
    marginLeft: 15,
    flex: 1,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  paymentNumber: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  paymentExpiry: {
    fontSize: 12,
    color: '#999',
  },
  paymentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
  actionButton: {
    padding: 5,
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
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 20,
    gap: 8,
  },
  securityText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
}); 