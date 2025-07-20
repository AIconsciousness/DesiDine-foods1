import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function PaymentSuccessScreen({ route, navigation }) {
  const { order, payment } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialIcons name="check-circle" size={80} color="#43a047" />
      </View>
      <Text style={styles.title}>Payment Successful</Text>
      <Text style={styles.subtitle}>Thank you for your order!</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Details</Text>
        <Text style={styles.label}>Order ID: <Text style={styles.value}>{order.orderId}</Text></Text>
        <Text style={styles.label}>Transaction ID: <Text style={styles.value}>{payment.transactionId}</Text></Text>
        <Text style={styles.label}>Amount Paid: <Text style={styles.value}>₹{payment.amount}</Text></Text>
        <Text style={styles.label}>Payment Time: <Text style={styles.value}>{new Date(payment.timestamp).toLocaleString()}</Text></Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Items</Text>
        {order.items.map((item, idx) => (
          <View key={idx} style={styles.itemRow}>
            <Text style={styles.itemName}>{item.menuItem?.name || 'Item'}</Text>
            <Text style={styles.itemQty}>x{item.quantity}</Text>
            <Text style={styles.itemPrice}>₹{item.menuItem?.price || '-'}</Text>
          </View>
        ))}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>₹{order.total}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        <Text style={styles.value}>{order.deliveryAddress || 'N/A'}</Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('OrderTracking', { orderId: order.orderId })}>
          <Text style={styles.buttonText}>Track Order</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={() => navigation.navigate('Home')}>
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f1f8e9',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 40,
  },
  iconContainer: {
    marginTop: 30,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#388e3c',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#4caf50',
    marginBottom: 18,
    textAlign: 'center',
  },
  section: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
    shadowColor: '#388e3c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#388e3c',
    marginBottom: 8,
  },
  label: {
    fontSize: 15,
    color: '#333',
    marginBottom: 2,
  },
  value: {
    fontWeight: 'bold',
    color: '#222',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 15,
    color: '#222',
    flex: 1,
  },
  itemQty: {
    fontSize: 15,
    color: '#666',
    width: 40,
    textAlign: 'center',
  },
  itemPrice: {
    fontSize: 15,
    color: '#222',
    width: 60,
    textAlign: 'right',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 6,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#388e3c',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#388e3c',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 18,
  },
  button: {
    flex: 1,
    backgroundColor: '#43a047',
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#43a047',
  },
  secondaryButtonText: {
    color: '#43a047',
  },
}); 