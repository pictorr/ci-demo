const mongoose = require('mongoose');

const systemCodesSystems = new mongoose.Schema({
    importName: mongoose.Schema.Types.String,
    hMin: mongoose.Schema.Types.Number,
    hMax: mongoose.Schema.Types.Number,
    valueSoundInsulation: mongoose.Schema.Types.Number,
    interaxSustineri: mongoose.Schema.Types.Number,
    autoportante: mongoose.Schema.Types.Number,
    structureLink: mongoose.Schema.Types.Number,
    protectionSense: mongoose.Schema.Types.Number,
    valueHoldingInterax: mongoose.Schema.Types.Number,
    thickness: mongoose.Schema.Types.Number,
    distance: mongoose.Schema.Types.Number,
    basePlate: mongoose.Schema.Types.Number,
    soundInsulation: mongoose.Schema.Types.String,
    fireResistance: mongoose.Schema.Types.String,
    profileType: mongoose.Schema.Types.String,
    moistureResistance: mongoose.Schema.Types.String,
    burglaryResistance: mongoose.Schema.Types.String,
    support: mongoose.Schema.Types.String,
    systemCode: mongoose.Schema.Types.String,
    systemCodeTable: mongoose.Schema.Types.String,
    auxilary: mongoose.Schema.Types.String,
    codSap1: mongoose.Schema.Types.String,
    codSap2: mongoose.Schema.Types.String,
    codSap3: mongoose.Schema.Types.String,
    codSap4: mongoose.Schema.Types.String,
    intermediatePlate: mongoose.Schema.Types.String,
    systemAccess: mongoose.Schema.Types.String,
    interax: mongoose.Schema.Types.String,
    plates: {
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
    },
    platingPlates: {
        plate1: mongoose.Schema.Types.String,
        plate2: mongoose.Schema.Types.String,
        plate3: mongoose.Schema.Types.String,
        plate4: mongoose.Schema.Types.String,
    },
});

systemCodesSystems.index({ importName: 1 });

module.exports = systemCodesSystems;