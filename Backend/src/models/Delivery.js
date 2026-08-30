const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema(
	{
		customerName: {
			type: String,
			required: [true, 'Customer name is required'],
			minlength: [2, 'Customer name must be at least 2 characters'],
			trim: true
		},
		customerPhone: {
			type: String,
			required: [true, 'Customer phone is required'],
			match: [/^(?:0|254|\+254)(?:1|7)\d{8}$/, 'Enter a valid Kenyan phone number'],
			trim: true
		},
		deliveryAddress: {
			type: String,
			required: [true, 'Delivery address is required'],
			minlength: [5, 'Delivery address must be at least 5 characters'],
			trim: true
		},
		itemDescription: {
			type: String,
			required: [true, 'Item description is required'],
			minlength: [2, 'Item description must be at least 2 characters'],
			trim: true
		},
		notes: {
			type: String,
			trim: true,
			default: ''
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		productCategory: {
			type: String,
			enum: ['Refrigerator', 'Television', 'Sound Bar', 'Laptop', 'Other Electronics'],
			required: [true, 'Product category is required']
		},
		status: {
			type: String,
			enum: ['Requested', 'Assigned', 'Picked Up', 'Delivered'],
			default: 'Requested'
		},
		assignedRider: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			default: null
		},
		proofOfDelivery: {
			type: String,
			trim: true,
			default: null
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Delivery', deliverySchema);