const mongoose = require('mongoose');

const savedOffersSchema = new mongoose.Schema({
    createdAt: mongoose.Schema.Types.Date,
    userId: mongoose.Schema.Types.ObjectId,
    status: {
        type: mongoose.Schema.Types.String,
        enum: ["draft", "saved"],
        default: "draft",
    },
    profileType: mongoose.Schema.Types.String,
    height: mongoose.Schema.Types.Number,
    soundInsulationMin: mongoose.Schema.Types.Number,
    soundInsulationMax: mongoose.Schema.Types.Number,
    intermediatePlate: mongoose.Schema.Types.String,
    basedPlates: mongoose.Schema.Types.String,
    thicknessSystem: mongoose.Schema.Types.String,
    fireResistance: mongoose.Schema.Types.String,
    ceilingSupport: mongoose.Schema.Types.String,
    interax: mongoose.Schema.Types.String,
    moistureResistance: mongoose.Schema.Types.String,
    burglaryResistance: mongoose.Schema.Types.String,
    protectionSense: mongoose.Schema.Types.String,
    soundInsulation: mongoose.Schema.Types.String,
    interaxSustineri: mongoose.Schema.Types.String,
    support: mongoose.Schema.Types.String,
    finishing: mongoose.Schema.Types.String,
    izolareAcustica: mongoose.Schema.Types.Number,
    systemCode: mongoose.Schema.Types.String,
    systemCodeTable: mongoose.Schema.Types.String,
    codSap1: mongoose.Schema.Types.String,
    codSap2: mongoose.Schema.Types.String,
    codSap3: mongoose.Schema.Types.String,
    plate: {
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
    initialPlate: {
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
    },
    platingPlates: {
        plate1: mongoose.Schema.Types.String,
        plate2: mongoose.Schema.Types.String,
        plate3: mongoose.Schema.Types.String,
        plate4: mongoose.Schema.Types.String,
    },
    platingInitialPlates: {
        plate1: mongoose.Schema.Types.String,
        plate2: mongoose.Schema.Types.String,
        plate3: mongoose.Schema.Types.String,
        plate4: mongoose.Schema.Types.String,
    },
    price: mongoose.Schema.Types.Number,
    consumption: mongoose.Schema.Types.Array,
    consumptionExterior: mongoose.Schema.Types.Array,
    systemName: mongoose.Schema.Types.String,
    surface: {
        type: mongoose.Schema.Types.Number,
        default: 1,
    },
    jointLength: {
        type: mongoose.Schema.Types.Number,
        default: 1,
    },
    excelName: mongoose.Schema.Types.String,
}, {
    timestamps: true,
});

module.exports = savedOffersSchema;