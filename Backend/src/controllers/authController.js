const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const createToken = (user) => jwt.sign(
	{ id: user._id, role: user.role },
	process.env.JWT_SECRET,
	{ expiresIn: '1d' }
);

const register = async (req, res) => {
	try {
		const { name, email, password } = req.body;
		const existingUser = await User.findOne({ email });

		if (existingUser) {
			return res.status(409).json({ success: false, message: 'Email is already registered' });
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await User.create({ name, email, password: hashedPassword, role: 'retailer' });

		res.status(201).json({ success: true, data: { id: user._id, name: user.name, email: user.email, role: user.role, token: createToken(user) } });
	} catch (error) {
		res.status(400).json({ success: false, message: error.message });
	}
};

const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email }).select('+password');

		if (!user || !(await bcrypt.compare(password, user.password))) {
			return res.status(401).json({ success: false, message: 'Invalid email or password' });
		}

		res.status(200).json({ success: true, data: { id: user._id, name: user.name, email: user.email, role: user.role, token: createToken(user) } });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

module.exports = { register, login };