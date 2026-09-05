const express = require('express');
const cors = require('cors');
const deliveryRoutes = require('./routes/deliveryRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors({
	origin: ['https://reflex-delivery-syst-fork-e6t7.vercel.app/'],
	credentials: true,
}));
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
