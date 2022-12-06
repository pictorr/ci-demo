const mongoose = require('mongoose');

const users = mongoose.model('users', require('./schemas/usersSchema.js'));
const images = mongoose.model('images', require('./schemas/imagesSchema.js'));
const imports = mongoose.model('imports', require('./schemas/importedPlatesSchema.js'));
const importsConsumptions = mongoose.model('importsConsumptions', require('./schemas/importedConsumptionsSchema.js'));
const offer = mongoose.model('offer', require('./schemas/offerSchema.js'));
const allowedPlates = mongoose.model('allowedPlates', require('./schemas/allowedPlatesSchema.js'));
const products = mongoose.model('products', require('./schemas/productsSchema.js'));
const currentOffer = mongoose.model('currentOffer', require('./schemas/currentOfferSchema.js'));
const savedOffers = mongoose.model('savedoffers', require('./schemas/savedOffersSchema.js'));
const uploads = mongoose.model('uploads', require('./schemas/uploadsSchema.js'));
const session = mongoose.model('session', require('./schemas/sessionSchema.js'));
const systemCodes = mongoose.model('systemCodes', require('./schemas/systemCodesSystemsSchema.js'));
const platingPlates = mongoose.model('platingPlates', require('./schemas/platingPlatesSchema.js'));
const doubleStructurePlates = mongoose.model('doubleStructurePlates', require('./schemas/doubleStructurePlatesSchema.js'));

module.exports = {
	users,
	images,
	imports,
	importsConsumptions,
	offer,
	allowedPlates,
	products,
	currentOffer,
	savedOffers,
	uploads,
	session,
	systemCodes,
	platingPlates,
	doubleStructurePlates,
};