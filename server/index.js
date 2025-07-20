const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
connectDB();

app.use(express.json());
app.use(cors());
app.use(helmet());

// Rate limiter for auth endpoints
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests, please try again later.'
});
app.use('/api/auth', limiter);

// Routes
app.get('/', (req, res) => res.send('DesiDine API Running'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/address', require('./routes/address'));
app.use('/api/restaurant', require('./routes/restaurant'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/order', require('./routes/order'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/notification', require('./routes/notification'));
app.use('/api/offer', require('./routes/offer'));
app.use('/api/review', require('./routes/review'));
app.use('/api/upload', require('./routes/upload'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 