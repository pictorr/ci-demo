const mongoose = require('mongoose');

const currentOfferSchema = new mongoose.Schema({
    typeName: mongoose.Schema.Types.String,
    openSystems: mongoose.Schema.Types.String,
    profileType: mongoose.Schema.Types.String,
    height: mongoose.Schema.Types.Number,
    fireResistance: mongoose.Schema.Types.String,
    interax: mongoose.Schema.Types.String,
    moistureResistance: mongoose.Schema.Types.String,
    soundInsulation: mongoose.Schema.Types.String,
    support: mongoose.Schema.Types.String,
    finishing: mongoose.Schema.Types.String,
    face1: {
        plate1: mongoose.Schema.Types.String,
        plate2: mongoose.Schema.Types.String,
        plate3: mongoose.Schema.Types.String,
    },
    face2: {
        plate1: mongoose.Schema.Types.String,
        plate2: mongoose.Schema.Types.String,
        plate3: mongoose.Schema.Types.String,
    },
});

module.exports = currentOfferSchema;