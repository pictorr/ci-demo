const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    emailAddress: mongoose.Schema.Types.String,
    company: mongoose.Schema.Types.String,
    job: mongoose.Schema.Types.String,
    address: mongoose.Schema.Types.String,
    locality: mongoose.Schema.Types.String,
    state: mongoose.Schema.Types.String,
    password: mongoose.Schema.Types.String,
    activationId: mongoose.Schema.Types.String,
    activated: {
        type: mongoose.Schema.Types.Boolean,
        default: false,
    },
    accountDisabled: {
        type: mongoose.Schema.Types.Boolean,
        default: false,
    },
    resetPasswordId: mongoose.Schema.Types.String,
    firstName: mongoose.Schema.Types.String,
    lastName: mongoose.Schema.Types.String,
    phoneNumber: mongoose.Schema.Types.String,
    savedOffers: [],
    language: {
        type: mongoose.Schema.Types.String, 
        enum: [ 'ro', 'en', 'gr', 'pl', 'bg', 'cr', 'sb' ],
        default: 'ro'
    },
    country: {
        type: mongoose.Schema.Types.String, 
        enum: [ 'ro', 'en', 'gr', 'pl', 'bg', 'cr', 'sb' ],
        default: 'ro'
    },
    isAdmin: {
        type: mongoose.Schema.Types.Boolean,
        default: false,
    },
    isMasterAdmin: {
        type: mongoose.Schema.Types.Boolean,
        default: false,
    },
    functionalitiesAccess: {
        type: mongoose.Schema.Types.Boolean,
        default: false,
    },
    createdOn: {
        type: mongoose.Schema.Types.Date,
        default: Date.now
    },
    lastLogin: {
        type: mongoose.Schema.Types.Date
    },
    logins: [{
        type: mongoose.Schema.Types.Date,
        default: Date.now
    }],
    cities: [{
        county: mongoose.Schema.Types.String,
        selected: mongoose.Schema.Types.Boolean,
    }],
    image: {
        small: mongoose.Schema.Types.ObjectId,
        medium: mongoose.Schema.Types.ObjectId,
        original: mongoose.Schema.Types.ObjectId,
    },
    consent: { type: mongoose.Schema.Types.Boolean, default: true },
    consentTimestamp: { type: mongoose.Schema.Types.Date, default: Date.now }
});

module.exports = usersSchema;