const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId, 
    data: {
        company: mongoose.Schema.Types.String,
        contactPerson: mongoose.Schema.Types.String,
        email: mongoose.Schema.Types.String,
        phoneNumber: mongoose.Schema.Types.String,
        objective: mongoose.Schema.Types.String,
        typeObjective: mongoose.Schema.Types.String,
        code: mongoose.Schema.Types.String,
        location: mongoose.Schema.Types.String,
        description: mongoose.Schema.Types.String,
        validationDate: mongoose.Schema.Types.String,
    },
    session: [{
        createdAt:mongoose.Schema.Types.Date,
        savedOfferId: mongoose.Schema.Types.ObjectId, 
        profileType: mongoose.Schema.Types.String,
        intermediatePlate: mongoose.Schema.Types.String,
        soundInsulationMin: mongoose.Schema.Types.Number,
        soundInsulationMax: mongoose.Schema.Types.Number,
        basedPlates: mongoose.Schema.Types.String,
        protectionSense: mongoose.Schema.Types.String,
        thicknessSystem: mongoose.Schema.Types.String,
        height: mongoose.Schema.Types.Number,
        ceilingSupport: mongoose.Schema.Types.String,
        fireResistance: mongoose.Schema.Types.String,
        interax: mongoose.Schema.Types.String,
        moistureResistance: mongoose.Schema.Types.String,
        burglaryResistance: mongoose.Schema.Types.String,
        soundInsulation: mongoose.Schema.Types.String,
        interaxSustineri: mongoose.Schema.Types.String,
        support: mongoose.Schema.Types.String,
        finishing: mongoose.Schema.Types.String,
        izolareAcustica: mongoose.Schema.Types.Number,
        systemCode: mongoose.Schema.Types.String,
        systemCodeTable: mongoose.Schema.Types.String,
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
        initialFace1: {
                plate1: mongoose.Schema.Types.String,
                plate2: mongoose.Schema.Types.String,
                plate3: mongoose.Schema.Types.String,
        },
        initialFace2: {
            plate1: mongoose.Schema.Types.String,
            plate2: mongoose.Schema.Types.String,
            plate3: mongoose.Schema.Types.String,
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
    }],
    createdOn: {
		type: mongoose.Schema.Types.Date,
		default: Date.now
	}
});

module.exports = sessionSchema;