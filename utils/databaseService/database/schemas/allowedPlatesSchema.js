const mongoose = require('mongoose');

const allowedPlatesSchema = new mongoose.Schema({
    plateName: mongoose.Schema.Types.String,
    importName: mongoose.Schema.Types.String,
    fireResistance: mongoose.Schema.Types.String,
    canReplacePlate: [{
        plate: mongoose.Schema.Types.String,
        fireResistance: {
            type: mongoose.Schema.Types.String,
            default: '-'
        },
    }],
});

module.exports = allowedPlatesSchema;