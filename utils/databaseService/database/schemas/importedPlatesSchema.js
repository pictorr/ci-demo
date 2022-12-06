const mongoose = require('mongoose');

const importsSchema = new mongoose.Schema({
    importName: mongoose.Schema.Types.String, 
    conditions: {
        conditionType: mongoose.Schema.Types.String,
        profileType: mongoose.Schema.Types.String,
        heightMin: mongoose.Schema.Types.Number,
        heightMax: mongoose.Schema.Types.Number,
        fireResistance: mongoose.Schema.Types.String,
        interax: mongoose.Schema.Types.String,
        ceilingType: mongoose.Schema.Types.String,
        moistureResistance: mongoose.Schema.Types.String,
        burglaryResistance: mongoose.Schema.Types.String,
    },
    plates: [{
        face1: {
            plate1: mongoose.Schema.Types.String,
            plate2: mongoose.Schema.Types.String,
            plate3: mongoose.Schema.Types.String,
        },
        face2: {
            plate1: mongoose.Schema.Types.String,
            plate2: mongoose.Schema.Types.String,
            plate3: mongoose.Schema.Types.String,
            plate4: mongoose.Schema.Types.String,
        },
    }],
});

module.exports = importsSchema;