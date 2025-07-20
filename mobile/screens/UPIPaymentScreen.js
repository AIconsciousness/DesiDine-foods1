import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  ScrollView,
  // Linking,
  Dimensions,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import * as Linking from 'expo-linking';
import {
  generateUPIUrl,
  generateUPIDeepLink,
  verifyUPIPayment,
  generateTransactionId,
  UPI_APPS,
  MERCHANT_CONFIG,
} from '../utils/paymentUtils';

const { width } = Dimensions.get('window');

export default function UPIPaymentScreen({ route, navigation }) {
  const { orderDetails, totalAmount, orderId } = route.params;
  
  const [selectedPaymentOption, setSelectedPaymentOption] = useState('qr');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUPIApps, setShowUPIApps] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [upiQrCode, setUpiQrCode] = useState('');
  const [timer, setTimer] = useState(600); // 10 minutes in seconds
  const timerRef = useRef();
  const [timerExpired, setTimerExpired] = useState(false);

  useEffect(() => {
    // Generate UPI QR code URL using utility function
    const upiUrl = generateUPIUrl(
      MERCHANT_CONFIG.VPA,
      MERCHANT_CONFIG.NAME,
      orderId,
      totalAmount,
      MERCHANT_CONFIG.CODE
    );
    setUpiQrCode(upiUrl);
  }, [orderId, totalAmount]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setTimerExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const checkPaymentStatus = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL || 'http://10.25.23.177:5000/api'}/payment/upi/status/${orderId}`
      );
      const result = await response.json();
      if (result.success && result.payment.status === 'success') {
        navigation.replace('PaymentSuccessScreen', {
          order: orderDetails,
          payment: {
            transactionId: result.payment.transactionId,
            amount: result.payment.amount,
            timestamp: result.payment.timestamp,
          },
        });
      } else if (result.success && result.payment.status === 'pending') {
        Alert.alert('Payment Pending', 'Your payment is still pending. Please complete the payment in your UPI app.');
      } else {
        Alert.alert('Payment Failed', 'No successful payment detected for this order.');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to check payment status. Please try again.');
    }
    setIsProcessing(false);
  };

  const handleUPIPayment = async (app = null) => {
    setIsProcessing(true);
    setShowUPIApps(false);

    try {
      const upiUrl = generateUPIDeepLink(
        MERCHANT_CONFIG.VPA,
        MERCHANT_CONFIG.NAME,
        orderId,
        totalAmount
      );
      
      // Check if specific app is selected
      if (app) {
        const canOpen = await Linking.canOpenURL(app.deepLink);
        if (canOpen) {
          await Linking.openURL(upiUrl);
        } else {
          // Fallback to general UPI intent
          await Linking.openURL(upiUrl);
        }
      } else {
        // General UPI intent
        await Linking.openURL(upiUrl);
      }

      // Simulate payment processing
      setTimeout(() => {
        handlePaymentResponse(app?.name || 'unknown');
      }, 3000);

    } catch (error) {
      console.error('Error opening UPI app:', error);
      Alert.alert('Error', 'Unable to open UPI payment app. Please try again.');
      setIsProcessing(false);
    }
  };

  const handlePaymentResponse = async (upiApp = 'unknown') => {
    try {
      // Generate transaction ID using utility function
      const transactionId = generateTransactionId();
      
      // Simulate payment success/failure (70% success rate for demo)
      const isSuccess = Math.random() > 0.3;
      const status = isSuccess ? 'success' : 'failed';
      
      // Call backend API to verify payment using utility function
      const result = await verifyUPIPayment(
        orderId,
        transactionId,
        totalAmount,
        status,
        upiApp
      );

      if (result.success && status === 'success') {
        // Fetch order details (optional: you can fetch from backend if needed)
        navigation.replace('PaymentSuccessScreen', {
          order: orderDetails,
          payment: {
            transactionId,
            amount: totalAmount,
            timestamp: new Date().toISOString(),
          },
        });
      } else {
        Alert.alert('Payment Failed', 'Your payment could not be processed. Please try again.');
        setPaymentStatus('failed');
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      Alert.alert(
        'Payment Error',
        'Unable to verify payment. Please try again.',
        [
          {
            text: 'Try Again',
            onPress: () => {
              setPaymentStatus(null);
              setIsProcessing(false);
            },
          },
          {
            text: 'Cancel',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }
    setIsProcessing(false);
  };

  const renderPaymentOption = (option) => (
    <TouchableOpacity
      key={option.id}
      style={[
        styles.paymentOptionCard,
        selectedPaymentOption === option.id && styles.selectedPaymentOption,
      ]}
      onPress={() => setSelectedPaymentOption(option.id)}
    >
      <View style={styles.paymentOptionInfo}>
        <MaterialIcons
          name={option.icon}
          size={28}
          color={selectedPaymentOption === option.id ? '#FF6B6B' : '#666'}
        />
        <View style={styles.paymentOptionDetails}>
          <Text style={styles.paymentOptionName}>{option.name}</Text>
          <Text style={styles.paymentOptionDescription}>{option.description}</Text>
        </View>
      </View>
      <View style={[
        styles.radioButton,
        selectedPaymentOption === option.id && styles.selectedRadioButton,
      ]}>
        {selectedPaymentOption === option.id && (
          <View style={styles.radioButtonInner} />
        )}
      </View>
    </TouchableOpacity>
  );

  const renderUPIApp = (app) => (
    <TouchableOpacity
      key={app.id}
      style={styles.upiAppCard}
      onPress={() => handleUPIPayment(app)}
    >
      <Ionicons name={app.icon} size={32} color="#FF6B6B" />
      <Text style={styles.upiAppName}>{app.name}</Text>
    </TouchableOpacity>
  );

  const paymentOptions = [
    {
      id: 'qr',
      name: 'Scan QR Code',
      icon: 'qr-code',
      description: 'Scan QR code with any UPI app',
    },
    {
      id: 'vpa',
      name: 'Pay via UPI Intent',
      icon: 'account-balance-wallet',
      description: 'Choose your preferred UPI app',
    },
  ];

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
        <Text style={styles.headerTitle}>UPI Payment</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.orderCard}>
            <View style={styles.orderInfo}>
              <Text style={styles.orderId}>Order #{orderId}</Text>
              <Text style={styles.orderAmount}>₹{totalAmount}</Text>
            </View>
            <Text style={styles.orderDescription}>
              {orderDetails?.restaurantName || 'Food Order'}
            </Text>
          </View>
        </View>

        {/* Payment Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Payment Method</Text>
          <View style={styles.paymentOptionsCard}>
            {paymentOptions.map(renderPaymentOption)}
          </View>
        </View>

        {/* QR Code Section */}
        {selectedPaymentOption === 'qr' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Scan QR Code</Text>
            <View style={styles.qrCard}>
              <View style={styles.qrContainer}>
                {upiQrCode ? (
                  <QRCode
                    value={upiQrCode}
                    size={200}
                    color="#000"
                    backgroundColor="#FFF"
                  />
                ) : (
                  <ActivityIndicator size="large" color="#FF6B6B" />
                )}
              </View>
              <Text style={styles.qrInstructions}>
                Scan this QR code with any UPI app to pay ₹{totalAmount}
              </Text>
              <Text style={styles.merchantInfo}>
                Merchant: {MERCHANT_CONFIG.VPA}
              </Text>
            </View>
          </View>
        )}

        {/* UPI Intent Section */}
        {selectedPaymentOption === 'vpa' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pay via UPI</Text>
            <View style={styles.vpaCard}>
              <View style={styles.vpaInfo}>
                <MaterialIcons name="account-balance-wallet" size={24} color="#FF6B6B" />
                <View style={styles.vpaDetails}>
                  <Text style={styles.vpaLabel}>Merchant UPI ID</Text>
                  <Text style={styles.vpaValue}>{MERCHANT_CONFIG.VPA}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.payButton}
                onPress={() => setShowUPIApps(true)}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={styles.payButtonText}>Pay ₹{totalAmount}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Payment Status */}
        {paymentStatus && (
          <View style={styles.section}>
            <View style={[
              styles.statusCard,
              paymentStatus === 'success' ? styles.successCard : styles.failedCard
            ]}>
              <MaterialIcons
                name={paymentStatus === 'success' ? 'check-circle' : 'error'}
                size={32}
                color={paymentStatus === 'success' ? '#4CAF50' : '#F44336'}
              />
              <Text style={styles.statusText}>
                {paymentStatus === 'success' ? 'Payment Successful! 🎉' : 'Payment Failed'}
              </Text>
            </View>
          </View>
        )}

        {/* Timer and Payment Status Check */}
        {timerExpired ? (
          <View style={styles.section}>
            <View style={styles.statusCard}>
              <MaterialIcons name="error" size={32} color="#F44336" />
              <Text style={styles.statusText}>
                Payment timed out. Please try again or check your UPI app.
              </Text>
            </View>
            <TouchableOpacity
              style={styles.payButton}
              onPress={checkPaymentStatus}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.payButtonText}>I have paid / Check Payment Status</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Timer</Text>
            <View style={styles.timerCard}>
              <Text style={styles.timerText}>Time Remaining: {formatTime(timer)}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* UPI Apps Modal */}
      <Modal
        visible={showUPIApps}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowUPIApps(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose UPI App</Text>
              <TouchableOpacity
                onPress={() => setShowUPIApps(false)}
                style={styles.closeButton}
              >
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.upiAppsList}>
              {UPI_APPS.map(renderUPIApp)}
              
              <TouchableOpacity
                style={styles.genericUPIButton}
                onPress={() => handleUPIPayment()}
              >
                <MaterialIcons name="more-horiz" size={32} color="#FF6B6B" />
                <Text style={styles.upiAppName}>Other UPI Apps</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  orderCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  orderAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  orderDescription: {
    fontSize: 14,
    color: '#666',
  },
  paymentOptionsCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  paymentOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  selectedPaymentOption: {
    backgroundColor: '#FFF5F5',
  },
  paymentOptionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentOptionDetails: {
    marginLeft: 12,
    flex: 1,
  },
  paymentOptionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  paymentOptionDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#DDD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadioButton: {
    borderColor: '#FF6B6B',
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B6B',
  },
  qrCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  qrContainer: {
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 16,
  },
  qrInstructions: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  merchantInfo: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  vpaCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  vpaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  vpaDetails: {
    marginLeft: 12,
    flex: 1,
  },
  vpaLabel: {
    fontSize: 14,
    color: '#666',
  },
  vpaValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 2,
  },
  payButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  successCard: {
    backgroundColor: '#E8F5E8',
  },
  failedCard: {
    backgroundColor: '#FFEBEE',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  upiAppsList: {
    padding: 20,
  },
  upiAppCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 12,
  },
  upiAppName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 16,
  },
  genericUPIButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    marginBottom: 12,
  },
  timerCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  timerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
}); 