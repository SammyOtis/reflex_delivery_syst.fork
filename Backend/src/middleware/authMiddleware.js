const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
	const token = req.headers.authorization?.startsWith('Bearer ')
		? req.headers.authorization.split(' ')[1]
		: null;

	if (!token) {
		return res.status(401).json({ success: false, message: 'Authentication required' });
	}

	try {
		req.user = jwt.verify(token, process.env.JWT_SECRET);
		next();
	} catch (error) {
		res.status(401).json({ success: false, message: 'Invalid or expired token' });
	}
};

const allowRoles = (...roles) => (req, res, next) => {
	if (!roles.includes(req.user.role)) {
		return res.status(403).json({ success: false, message: 'You do not have permission for this action' });
	}
	next();
};

module.exports = { protect, allowRoles };