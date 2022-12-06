const mongoose = require('mongoose');

// Doesn't necessarily need a dinosaurId field, but you can add it if you want to
const imagesSchema = new mongoose.Schema({
	url: mongoose.Schema.Types.String,
	variant: {
		type: mongoose.Schema.Types.String,
		enum: ['small', 'medium', 'original']
	},
	createdOn: {
		type: mongoose.Schema.Types.Date,
		default: Date.now
	}
});

module.exports = imagesSchema;