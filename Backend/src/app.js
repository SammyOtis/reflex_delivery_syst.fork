const express = require('express');
const cors = require('cors');
const deliveryRoutes = require('./routes/deliveryRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

const allowedOrigins = [
  'https://reflex-delivery-syst-fork-e6t7.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200 // Legacy browsers / proxies choke on 204
};

// 1. Enable CORS pre-flight across all routes
app.use(cors(corsOptions));

// 2. Explicitly intercept and respond to OPTIONS requests immediately
app.options('*', cors(corsOptions));

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/deliveries', deliveryRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Reflex API is running'
  });
});

module.exports = app;