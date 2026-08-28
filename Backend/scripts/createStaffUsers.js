require('dotenv').config();

const bcrypt = require('bcryptjs');
const connectDB = require('../src/config/db');
const User = require('../src/models/User');

const staffUsers = [
	{
		name: process.env.DISPATCHER_NAME || 'Reflex Dispatcher',
		email: process.env.DISPATCHER_EMAIL,
		password: process.env.DISPATCHER_PASSWORD,
		role: 'dispatcher'
	},
	{
		name: process.env.RIDER_NAME || 'Reflex Rider',
		email: process.env.RIDER_EMAIL,
		password: process.env.RIDER_PASSWORD,
		role: 'rider'
	}
];

const createStaffUsers = async () => {
	await connectDB();

	for (const staffUser of staffUsers) {
		if (!staffUser.email || !staffUser.password) {
			throw new Error(`Missing credentials for ${staffUser.role}. Add them to .env`);
		}

		const password = await bcrypt.hash(staffUser.password, 10);
		await User.findOneAndUpdate(
			{ email: staffUser.email },
			{ ...staffUser, password },
			{ upsert: true, new: true, setDefaultsOnInsert: true }
		);
		console.log(`${staffUser.role} account ready: ${staffUser.email}`);
	}

	process.exit(0);
};

createStaffUsers().catch((error) => {
	console.error(`Unable to create staff accounts: ${error.message}`);
	process.exit(1);
});