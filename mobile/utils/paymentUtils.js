// UPI Payment Utility Functions

const API_BASE_URL = 'https://desidine-foods1.onrender.com/api';

// Generate UPI URL for QR code
export const generateUPIUrl = (merchantVPA, merchantName, orderId, amount, merchantCode = '0000') => {
  return `upi://pay?pa=${merchantVPA}&pn=${encodeURIComponent(merchantName)}&mc=${merchantCode}&tid=${orderId}&tr=${orderId}&tn=${encodeURIComponent(`DesiDine Food Order - ${orderId}`)}&am=${amount}&cu=INR`;
};

// Generate UPI deep link for intent
export const generateUPIDeepLink = (merchantVPA, merchantName, orderId, amount) => {
  return `upi://pay?pa=${merchantVPA}&pn=${encodeURIComponent(merchantName)}&tr=${orderId}&tn=${encodeURIComponent(`Food Order - ${orderId}`)}&am=${amount}&cu=INR`;
};

// Verify UPI payment with backend
export const verifyUPIPayment = async (orderId, transactionId, amount, status, upiApp = 'unknown') => {
  try {
    const response = await fetch(`${API_BASE_URL}/payment/upi/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId,
        transactionId,
        amount,
        status,
        upiApp,
      }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('UPI payment verification error:', error);
    throw error;
  }
};

// Get UPI payment status
export const getUPIPaymentStatus = async (orderId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/payment/upi/status/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Get UPI payment status error:', error);
    throw error;
  }
};

// Generate transaction ID
export const generateTransactionId = () => {
  return `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;
};

// UPI Apps configuration
export const UPI_APPS = [
  {
    id: 'googlepay',
    name: 'Google Pay',
    icon: 'logo-google',
    package: 'com.google.android.apps.nbu.paisa.user',
    deepLink: 'googlepay://',
  },
  {
    id: 'phonepe',
    name: 'PhonePe',
    icon: 'phone-portrait',
    package: 'com.phonepe.app',
    deepLink: 'phonepe://',
  },
  {
    id: 'paytm',
    name: 'Paytm',
    icon: 'wallet',
    package: 'net.one97.paytm',
    deepLink: 'paytm://',
  },
  {
    id: 'bhim',
    name: 'BHIM',
    icon: 'card',
    package: 'in.org.npci.upiapp',
    deepLink: 'bhim://',
  },
  {
    id: 'amazonpay',
    name: 'Amazon Pay',
    icon: 'logo-amazon',
    package: 'in.amazonpay',
    deepLink: 'amazonpay://',
  },
];

// Merchant configuration
export const MERCHANT_CONFIG = {
  VPA: '720921300372@axl',
  NAME: 'kamlesh kumar sharma',
  CODE: '0000',
}; 