const mongoose = require('mongoose');

const importConditionsConsuptionsSchema = new mongoose.Schema({
    importName: mongoose.Schema.Types.String,
    conditions: {
        profileType: mongoose.Schema.Types.String,
        primaryProfileType: mongoose.Schema.Types.String, // ceilings
        secondaryProfileType: mongoose.Schema.Types.String, // ceilings
        thickness: mongoose.Schema.Types.String, // walls_s
        distance: mongoose.Schema.Types.String, // walls_s
        structureLink: mongoose.Schema.Types.String, // walls_s
        interax: mongoose.Schema.Types.String,
        primaryInterax: mongoose.Schema.Types.String, // ceilings
        secondaryInterax: mongoose.Schema.Types.String, // ceilings
        interaxSustineri: mongoose.Schema.Types.String, // linnings and ceilings
        heightMin: mongoose.Schema.Types.String,
        heightMax: mongoose.Schema.Types.String,
        support: mongoose.Schema.Types.String,
        ceilingSupport: mongoose.Schema.Types.String, // ceilings
        soundInsulation: mongoose.Schema.Types.String,
        fireResistance: mongoose.Schema.Types.String,
        moistureResistance: mongoose.Schema.Types.String,
        depthPlate: mongoose.Schema.Types.String,
        finishing: mongoose.Schema.Types.String,
        accessory: mongoose.Schema.Types.String,
        burglaryResistance: mongoose.Schema.Types.String,
        consumptionType: mongoose.Schema.Types.String,
        basePlate: mongoose.Schema.Types.String,
    },
    codSap: mongoose.Schema.Types.String,
    productName: mongoose.Schema.Types.String,
    quantity: mongoose.Schema.Types.Number,
    quantityFormula: mongoose.Schema.Types.Number,
    price: mongoose.Schema.Types.Number,
    unitMeasure: mongoose.Schema.Types.String,
    weight: mongoose.Schema.Types.Number,
    category: mongoose.Schema.Types.String,
});

module.exports = importConditionsConsuptionsSchema;