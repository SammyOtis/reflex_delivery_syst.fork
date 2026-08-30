const express = require('express');
const { createDelivery, getDeliveries, getRiders, assignDelivery, updateDeliveryStatus } = require('../controllers/deliveryController');
const { protect, allowRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
	.post(protect, allowRoles('retailer'), createDelivery)
	.get(protect, allowRoles('retailer', 'dispatcher', 'rider'), getDeliveries);
router.get('/open', protect, allowRoles('dispatcher'), getDeliveries);
router.get('/assigned', protect, allowRoles('rider'), getDeliveries);
router.get('/riders', protect, allowRoles('dispatcher'), getRiders);
router.patch('/:id/assign', protect, allowRoles('dispatcher'), assignDelivery);
router.patch('/:id/status', protect, allowRoles('rider'), updateDeliveryStatus);

module.exports = router;