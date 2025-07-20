# 🚀 UPI Payment System Implementation

## 📋 Overview

This document describes the complete UPI (Unified Payments Interface) payment system implementation for the DesiDine food delivery app. The system supports both QR code scanning and UPI intent-based payments.

## ✨ Features

### 🔐 Core Features
- **QR Code Generation**: Auto-generates UPI QR codes with order details
- **UPI Intent Support**: Launches UPI apps via deep links
- **Multiple UPI Apps**: Supports Google Pay, PhonePe, Paytm, BHIM, Amazon Pay
- **Payment Verification**: Backend API for payment status tracking
- **Transaction Logging**: Complete payment history and audit trail

### 🎯 User Flow
1. User places order in checkout screen
2. Selects "UPI" as payment method
3. Chooses between QR code or UPI intent
4. Completes payment via preferred UPI app
5. Receives payment confirmation

## 🏗️ Architecture

### Frontend (React Native/Expo)
```
mobile/
├── screens/
│   └── UPIPaymentScreen.js          # Main UPI payment screen
├── utils/
│   └── paymentUtils.js              # UPI payment utilities
└── navigation/
    └── AppNavigator.js              # Navigation with UPI screen
```

### Backend (Node.js/Express)
```
server/
├── routes/
│   └── payment.js                   # Payment API routes
├── controllers/
│   └── paymentController.js         # UPI payment logic
└── models/
    └── Payment.js                   # Payment data model
```

## 🔧 Technical Implementation

### 1. QR Code Generation

**UPI URL Format:**
```
upi://pay?pa=merchant@upi&pn=DesiDine&mc=0000&tid=ORDERID&tr=ORDERID&tn=DesiDine%20Food%20Order&am=amount&cu=INR
```

**Parameters:**
- `pa`: Payee Address (Merchant VPA)
- `pn`: Payee Name
- `mc`: Merchant Code
- `tid`: Transaction ID
- `tr`: Transaction Reference
- `tn`: Transaction Note
- `am`: Amount
- `cu`: Currency

### 2. UPI Deep Link Intent

**Intent URL:**
```
upi://pay?pa=merchant@upi&pn=DesiDine&tr=ORDERID&tn=Food%20Order&am=amount&cu=INR
```

### 3. Supported UPI Apps

| App | Package Name | Deep Link |
|-----|-------------|-----------|
| Google Pay | `com.google.android.apps.nbu.paisa.user` | `googlepay://` |
| PhonePe | `com.phonepe.app` | `phonepe://` |
| Paytm | `net.one97.paytm` | `paytm://` |
| BHIM | `in.org.npci.upiapp` | `bhim://` |
| Amazon Pay | `in.amazonpay` | `amazonpay://` |

## 📱 Frontend Implementation

### UPIPaymentScreen.js

**Key Features:**
- QR code display using `react-native-qrcode-svg`
- UPI app selection modal
- Payment status tracking
- Error handling and retry logic

**State Management:**
```javascript
const [selectedPaymentOption, setSelectedPaymentOption] = useState('qr');
const [isProcessing, setIsProcessing] = useState(false);
const [showUPIApps, setShowUPIApps] = useState(false);
const [paymentStatus, setPaymentStatus] = useState(null);
const [upiQrCode, setUpiQrCode] = useState('');
```

### paymentUtils.js

**Utility Functions:**
- `generateUPIUrl()`: Creates QR code URL
- `generateUPIDeepLink()`: Creates intent URL
- `verifyUPIPayment()`: Backend API call
- `generateTransactionId()`: Unique transaction ID
- `UPI_APPS`: App configuration
- `MERCHANT_CONFIG`: Merchant details

## 🔌 Backend Implementation

### Payment Controller

**Endpoints:**
- `POST /api/payment/upi/verify`: Verify UPI payment
- `GET /api/payment/upi/status/:orderId`: Get payment status

**Payment Model Schema:**
```javascript
{
  order: String,           // Order ID
  user: ObjectId,          // User ID (optional)
  amount: Number,          // Payment amount
  provider: String,        // 'upi'
  status: String,          // 'pending', 'success', 'failed'
  paymentId: String,       // Transaction ID
  upiApp: String,          // UPI app used
  paymentMethod: String,   // Payment method type
  transactionDetails: Object // Additional transaction info
}
```

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
cd mobile
npm install react-native-qrcode-svg react-native-svg expo-linking
```

### 2. Backend Setup

```bash
cd server
npm install
```

### 3. Environment Variables

Create `.env` file in server directory:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

### 4. Start Development

```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
cd mobile
expo start
```

## 🧪 Testing

### Test UPI VPA
- **Development**: `desidine@upi` (mock VPA)
- **Production**: Replace with actual merchant VPA

### Test Scenarios
1. **QR Code Payment**: Scan QR with any UPI app
2. **Intent Payment**: Select specific UPI app
3. **Payment Success**: 70% success rate in demo
4. **Payment Failure**: 30% failure rate in demo

## 🔒 Security Considerations

### Production Checklist
- [ ] Use HTTPS for all API calls
- [ ] Implement proper authentication
- [ ] Validate payment amounts server-side
- [ ] Use real merchant VPA
- [ ] Implement webhook verification
- [ ] Add rate limiting
- [ ] Log all payment attempts

### UPI Security
- [ ] Validate UPI response URLs
- [ ] Implement signature verification
- [ ] Use secure transaction IDs
- [ ] Monitor for duplicate payments

## 📊 Payment Flow Diagram

```
User → Checkout → Select UPI → Choose Method
  ↓
QR Code ←→ UPI Intent
  ↓
UPI App → Payment Processing → Backend Verification
  ↓
Success/Failure → Order Confirmation
```

## 🐛 Troubleshooting

### Common Issues

1. **QR Code Not Generating**
   - Check `react-native-qrcode-svg` installation
   - Verify UPI URL format
   - Clear app cache

2. **UPI Intent Not Opening**
   - Check device has UPI apps installed
   - Verify deep link format
   - Test with different UPI apps

3. **Backend API Errors**
   - Check MongoDB connection
   - Verify API endpoints
   - Check server logs

4. **Payment Verification Fails**
   - Check network connectivity
   - Verify API base URL
   - Check request payload format

## 🔄 Future Enhancements

### Planned Features
- [ ] Real-time payment status updates
- [ ] Payment gateway integration (Razorpay, Cashfree)
- [ ] UPI collect requests
- [ ] Payment analytics dashboard
- [ ] Multi-currency support
- [ ] Offline payment support

### Integration Options
- **Razorpay**: For production-ready payment processing
- **Cashfree**: Alternative payment gateway
- **PhonePe**: Direct PhonePe integration
- **Paytm**: Direct Paytm integration

## 📞 Support

For technical support or questions:
- Check server logs for errors
- Verify API endpoints are accessible
- Test with different UPI apps
- Review payment model schema

## 📝 License

This UPI payment system is part of the DesiDine food delivery app and follows the same licensing terms.

---

**Note**: This implementation is for demonstration purposes. For production use, implement proper security measures and integrate with actual payment gateways. 