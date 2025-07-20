import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

export default function CheckoutScreen({ route, navigation }) {
  const {
    cartItems,
    restaurant,
    deliveryAddress,
    subtotal,
    deliveryFee,
    taxAmount,
    total,
  } = route.params;

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: 'credit-card',
      description: 'Pay with your card',
    },
    {
      id: 'upi',
      name: 'UPI',
      icon: 'account-balance-wallet',
      description: 'Pay using UPI',
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: 'money',
      description: 'Pay when you receive',
    },
  ];

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    // Generate order ID
    const orderId = Math.floor(Math.random() * 10000);
    
    // Check if UPI payment is selected
    if (selectedPaymentMethod === 'upi') {
      setIsProcessing(false);
      navigation.navigate('UPIPayment', {
        orderDetails: {
          restaurantName: restaurant?.name || 'Food Order',
          items: cartItems,
        },
        totalAmount: total.toFixed(2),
        orderId: orderId,
      });
      return;
    }
    
    // For other payment methods, simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      Alert.alert(
        'Order Placed Successfully! 🎉',
        `Your order #${orderId} has been placed and will be delivered in ${restaurant?.deliveryTime || '30-45 minutes'}.`,
        [
          {
            text: 'Track Order',
            onPress: () => navigation.navigate('OrderTracking', { orderId: orderId }),
          },
          {
            text: 'Back to Home',
            onPress: () => navigation.navigate('Home'),
          },
        ]
      );
    }, 2000);
  };

  const renderPaymentMethod = (method) => (
    <TouchableOpacity
      key={method.id}
      style={[
        styles.paymentMethodCard,
        selectedPaymentMethod === method.id && styles.selectedPaymentMethod,
      ]}
      onPress={() => setSelectedPaymentMethod(method.id)}
    >
      <View style={styles.paymentMethodInfo}>
        <MaterialIcons
          name={method.icon}
          size={24}
          color={selectedPaymentMethod === method.id ? '#FF6B6B' : '#666'}
        />
        <View style={styles.paymentMethodDetails}>
          <Text style={styles.paymentMethodName}>{method.name}</Text>
          <Text style={styles.paymentMethodDescription}>{method.description}</Text>
        </View>
      </View>
      <View style={[
        styles.radioButton,
        selectedPaymentMethod === method.id && styles.selectedRadioButton,
      ]}>
        {selectedPaymentMethod === method.id && (
          <View style={styles.radioButtonInner} />
        )}
      </View>
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
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Restaurant Info */}
        {restaurant && (
          <View style={styles.restaurantInfo}>
            <View style={styles.restaurantDetails}>
              <Text style={styles.restaurantName}>{restaurant.name}</Text>
              <Text style={styles.restaurantCuisine}>{restaurant.cuisine}</Text>
              <View style={styles.restaurantStats}>
                <View style={styles.statItem}>
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Text style={styles.statText}>{restaurant.rating}</Text>
                </View>
                <View style={styles.statItem}>
                  <MaterialIcons name="access-time" size={14} color="#666" />
                  <Text style={styles.statText}>{restaurant.deliveryTime}</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Delivery Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <View style={styles.addressCard}>
            <MaterialIcons name="location-on" size={20} color="#FF6B6B" />
            <View style={styles.addressInfo}>
              <Text style={styles.addressText}>{deliveryAddress}</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.orderCard}>
            {cartItems.map((item, index) => (
              <View key={item.id} style={styles.orderItem}>
                <View style={styles.orderItemInfo}>
                  <Text style={styles.orderItemName}>{item.name}</Text>
                  <Text style={styles.orderItemQuantity}>Qty: {item.quantity}</Text>
                </View>
                <Text style={styles.orderItemPrice}>₹{item.price * item.quantity}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Bill Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bill Details</Text>
          <View style={styles.billCard}>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Item Total</Text>
              <Text style={styles.billValue}>₹{subtotal}</Text>
            </View>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Delivery Fee</Text>
              <Text style={styles.billValue}>₹{deliveryFee}</Text>
            </View>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Taxes & Charges</Text>
              <Text style={styles.billValue}>₹{taxAmount.toFixed(2)}</Text>
            </View>
            <View style={styles.billDivider} />
            <View style={styles.billRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>₹{total.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentMethodsCard}>
            {paymentMethods.map(renderPaymentMethod)}
          </View>
        </View>

        {/* Offers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Offers</Text>
          <TouchableOpacity style={styles.offerCard}>
            <MaterialIcons name="local-offer" size={20} color="#FF6B6B" />
            <View style={styles.offerInfo}>
              <Text style={styles.offerTitle}>20% OFF on orders above ₹500</Text>
              <Text style={styles.offerSubtitle}>Use code: DESIDINE20</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Place Order Button */}
      <View style={styles.bottomPlaceOrder}>
        <View style={styles.placeOrderInfo}>
          <Text style={styles.placeOrderTotal}>₹{total.toFixed(2)}</Text>
          <Text style={styles.placeOrderSubtitle}>Total Amount</Text>
        </View>
        <TouchableOpacity
          style={[styles.placeOrderButton, isProcessing && styles.placeOrderButtonDisabled]}
          onPress={handlePlaceOrder}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="#FFF" size="small" />
          ) : (
            <Text style={styles.placeOrderButtonText}>Place Order</Text>
          )}
        </TouchableOpacity>
      </View>
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
  placeholder: {
    width: 34,
  },
  content: {
    flex: 1,
  },
  restaurantInfo: {
    backgroundColor: '#FFF',
    margin: 20,
    marginBottom: 10,
    borderRadius: 15,
    padding: 15,
  },
  restaurantDetails: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  restaurantCuisine: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  restaurantStats: {
    flexDirection: 'row',
    gap: 15,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 15,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressInfo: {
    flex: 1,
    marginLeft: 15,
  },
  addressText: {
    fontSize: 14,
    color: '#333',
  },
  changeText: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  orderCard: {
    gap: 12,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderItemInfo: {
    flex: 1,
  },
  orderItemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  orderItemQuantity: {
    fontSize: 12,
    color: '#666',
  },
  orderItemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  billCard: {
    gap: 12,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  billLabel: {
    fontSize: 14,
    color: '#666',
  },
  billValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  billDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 5,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  paymentMethodsCard: {
    gap: 12,
  },
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#F8F9FA',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPaymentMethod: {
    borderColor: '#FF6B6B',
    backgroundColor: '#FFF5F5',
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentMethodDetails: {
    marginLeft: 15,
  },
  paymentMethodName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  paymentMethodDescription: {
    fontSize: 12,
    color: '#666',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CCC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedRadioButton: {
    borderColor: '#FF6B6B',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF6B6B',
  },
  offerCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  offerInfo: {
    flex: 1,
    marginLeft: 15,
  },
  offerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  offerSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  bottomPlaceOrder: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  placeOrderInfo: {
    flex: 1,
  },
  placeOrderTotal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  placeOrderSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  placeOrderButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
  },
  placeOrderButtonDisabled: {
    backgroundColor: '#CCC',
  },
  placeOrderButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 