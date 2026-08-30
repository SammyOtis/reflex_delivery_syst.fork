const Delivery = require('../models/Delivery');
const User = require('../models/User');

const createDelivery = async (req, res) => {
	try {
		const {
			customerName,
			customerPhone,
			deliveryAddress,
			itemDescription,
			productDescription,
			productCategory,
			notes
		} = req.body;

		const finalItemDescription = itemDescription || productDescription;

		const delivery = await Delivery.create({
			customerName,
			customerPhone,
			deliveryAddress,
			itemDescription: finalItemDescription,
			productCategory,
			notes: notes || '',
			createdBy: req.user.id
		});
		res.status(201).json({ success: true, data: delivery });
	} catch (error) {
		res.status(400).json({ success: false, message: error.message });
	}
};

const getRiders = async (req, res) => {
	try {
		const riders = await User.find({ role: 'rider' }).select('name email');
		res.status(200).json({ success: true, count: riders.length, data: riders });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

const getDeliveries = async (req, res) => {
	try {
		const filter = req.user.role === 'dispatcher'
			? { status: 'Requested' }
			: req.user.role === 'rider'
				? { assignedRider: req.user.id }
				: { createdBy: req.user.id };
		const deliveries = await Delivery.find(filter).populate('assignedRider', 'name email').sort({ createdAt: -1 });
		res.status(200).json({ success: true, count: deliveries.length, data: deliveries });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

const assignDelivery = async (req, res) => {
	try {
		const rider = await User.findOne({ _id: req.body.riderId, role: 'rider' });
		if (!rider) {
			return res.status(404).json({ success: false, message: 'Rider not found' });
		}

		const delivery = await Delivery.findOneAndUpdate(
			{ _id: req.params.id, status: 'Requested' },
			{ assignedRider: rider._id, status: 'Assigned' },
			{ new: true, runValidators: true }
		).populate('assignedRider', 'name email');

		if (!delivery) {
			return res.status(404).json({ success: false, message: 'Open delivery not found' });
		}
		res.status(200).json({ success: true, data: delivery });
	} catch (error) {
		res.status(400).json({ success: false, message: error.message });
	}
};

const updateDeliveryStatus = async (req, res) => {
	try {
		const { status, proofOfDelivery } = req.body;
		const validStatuses = ['Assigned', 'Picked Up', 'Delivered'];
		if (!validStatuses.includes(status)) {
			return res.status(400).json({ success: false, message: 'Invalid status. Use Assigned, Picked Up, or Delivered' });
		}
		const delivery = await Delivery.findOne({ _id: req.params.id, assignedRider: req.user.id });
		const allowedNextStatus = { Assigned: 'Picked Up', 'Picked Up': 'Delivered' };

		if (!delivery) {
			return res.status(404).json({ success: false, message: 'Assigned delivery not found' });
		}
		if (allowedNextStatus[delivery.status] !== status) {
			return res.status(400).json({ success: false, message: `Status can only move from ${delivery.status} to the next step` });
		}
		if (status === 'Delivered' && !proofOfDelivery) {
			return res.status(400).json({ success: false, message: 'Proof of delivery is required' });
		}

		delivery.status = status;
		if (proofOfDelivery) delivery.proofOfDelivery = proofOfDelivery;
		await delivery.save();
		res.status(200).json({ success: true, data: delivery });
	} catch (error) {
		res.status(400).json({ success: false, message: error.message });
	}
};

module.exports = { createDelivery, getDeliveries, getRiders, assignDelivery, updateDeliveryStatus };