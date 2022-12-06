const mongoose = require('mongoose');

const uploadsSchema = new mongoose.Schema({
    user: mongoose.Schema.Types.String,
    importName: mongoose.Schema.Types.String,
    fileName: mongoose.Schema.Types.String,
    sourceFileName: { type: String, trim: true, default: '' },
    language: { type: String, trim: true, default: 'ro' }, 
}, {
    timestamps: true,
});

module.exports = uploadsSchema;