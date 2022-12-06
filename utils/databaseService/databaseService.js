const utilityService = require('../utilityService.js');
const usersConstructor = require('./database/models.js').users;
const dinosaursConstructor = require('./database/models.js').dinosaurs;
const imagesConstructor = require('./database/models.js').images;
const importedPlatesConstructor = require('./database/models.js').imports;
const importedConsumptionsConstructor = require('./database/models.js').importsConsumptions;
const offerConstructor = require('./database/models.js').offer;
const allowedPlatesConstructor = require('./database/models.js').allowedPlates;
const productsConstructor = require('./database/models.js').products;
const currentOfferConstructor = require('./database/models.js').currentOffer;
const savedOffersConstructor = require('./database/models.js').savedOffers;
const uploadsConstructor = require('./database/models.js').uploads;
const sessionConstructor = require('./database/models.js').session;
const systemCodesConstructor = require('./database/models.js').systemCodes;
const importedPlatingPlatesConstructor = require('./database/models.js').platingPlates;
const doubleStructurePlatesConstructor = require('./database/models.js').doubleStructurePlates;

/**
 * Saves a user in the database
 * @param data {Object}
 * @param language {String}
 * @returns {Promise}
 */
const saveUser = (data, language) => {
	return new Promise((resolve, reject) => {
		const newProduct = new usersConstructor(data);
		newProduct.save(err => {
			if (err) {
				return reject(utilityService.parseCodeMessage('database_error', language, err));
			}

			resolve(newProduct);
		})
	});
};

/**
 * Get multiple users by a query from the database
 * @param query {Object}
 * @param sort {Object}
 * @param limit {Object}
 * @param language {String}
 * @returns {Promise}
 */
const getUsersByField = (query, sort, limit, language) => {
	return new Promise((resolve, reject) => {
		let stages = [
			{ $match: query },
		];
		if (sort) {
			stages = [...stages, sort];
		}
		if (limit) {
			stages = [...stages, limit];
		}

		usersConstructor.aggregate(stages)
			.exec((err, users) => {
				if (err) {
					return reject(utilityService.parseCodeMessage('database_error', language, err));
				}

				return resolve(users);
			});
	})
};

/**
 * Get multiple users by a query from the database
 * @param query {Object}
 * @param sort {Object}
 * @param limit {Object}
 * @param language {String}
 * @returns {Promise}
 */
const getUsersByFieldNotFancy = (query, sort, limit, language) => {
	return new Promise((resolve, reject) => {
		usersConstructor.find(query)
			.exec((err, plates) => {
				if (err) {
					return reject(utilityService.parseCodeMessage('database_error', language, err));
				}
				return resolve(plates);
			});
	})
};

/**
 * Get a user by a query from the database
 * @param query {Object}
 * @param language {String}
 * @returns {Promise}
 */
const getUserByField = (query, language) => {
	return new Promise((resolve, reject) => {
		usersConstructor.findOne(query, (err, user) => {
			if (err) {
				return reject(utilityService.parseCodeMessage('database_error', language, err));
			}

			return resolve(user);
		})
	})
};

/**
 * Updates an user from the database
 * @param query {Object}
 * @param operation {Object}
 * @param language {String}
 * @returns {Promise}
 */
const updateUser = (query, operation, language) => {
	return new Promise((resolve, reject) => {
		usersConstructor.updateOne(query, operation, err => {
			if (err) {
				return reject(utilityService.parseCodeMessage('database_error', language, err));
			}

			resolve();
		});
	});
};

/**
 * Deletes a user from the database
 * @param query {Object}
 * @param language {String}
 * @returns {Promise}
 */
const deleteUser = (query, language) => {
	return new Promise((resolve, reject) => {
		usersConstructor.deleteOne(query, err => {
			if (err) {
				return reject(utilityService.parseCodeMessage('database_error', language, err));
			}

			resolve();
		});
	});
};

/**
 * Saves a dinosaur in the database
 * @param data {Object}
 * @param language {String}
 * @returns {Promise}
 */
const saveDinosaur = (data, language) => {
	return new Promise((resolve, reject) => {
		const newDinosaur = new dinosaursConstructor(data);
		newDinosaur.save(err => {
			if (err) {
				return reject(utilityService.parseCodeMessage('database_error', language, err));
			}

			resolve(newDinosaur);
		})
	});
};

/**
 * Get a dinosaur by a query from the database
 * @param query {Object}
 * @param language {String}
 * @returns {Promise}
 */
const getDinosaurByField = (query, language) => {
	return new Promise((resolve, reject) => {
		let variants = ['small', 'medium', 'original'];
		let stages = [
			{ $match: query },
			{
				$lookup: {
					from: 'images',
					localField: 'image.small',
					foreignField: '_id',
					as: 'imageSmall'
				}
			},
			{
				$unwind: {
					path: '$imageSmall',
					preserveNullAndEmptyArrays: true
				}
			}
		];
		variants.forEach(variant => {
			stages.push({
				$lookup: {
					from: 'images',
					localField: `image.${ variant }`,
					foreignField: '_id',
					as: `image${ variant.charAt(0).toUpperCase() + variant.slice(1) }`
				}
			});
			stages.push({
				$unwind: {
					path: `$image${ variant.charAt(0).toUpperCase() + variant.slice(1) }`,
					preserveNullAndEmptyArrays: true
				}
			});
		});

		dinosaursConstructor.aggregate(stages)
			.exec((err, dinosaur) => {
				if (err) {
					return reject(utilityService.parseCodeMessage('database_error', language, err));
				}

				return resolve(( dinosaur || [] )[0]);
			});
	})
};

/**
 * Get multiple dinosaurs by a query from the database
 * @param query {Object}
 * @param sort {Object}
 * @param limit {Object}
 * @param language {String}
 * @returns {Promise}
 */
const getDinosaursByField = (query, sort, limit, language) => {
	return new Promise((resolve, reject) => {
		let stages = [
			{ $match: query },
		];
		if (sort) {
			stages = [...stages, sort];
		}
		if (limit) {
			stages = [...stages, limit];
		}

		dinosaursConstructor.aggregate(stages)
			.exec((err, dinosaurs) => {
				if (err) {
					return reject(utilityService.parseCodeMessage('database_error', language, err));
				}

				return resolve(dinosaurs);
			});
	})
};

/**
 * Updates an dinosaur from the database
 * @param query {Object}
 * @param operation {Object}
 * @param language {String}
 * @returns {Promise}
 */
const updateDinosaur = (query, operation, language) => {
	return new Promise((resolve, reject) => {
		dinosaursConstructor.updateOne(query, operation, err => {
			if (err) {
				return reject(utilityService.parseCodeMessage('database_error', language, err));
			}

			resolve();
		});
	});
};

/**
 * Deletes a dinosaur from the database
 * @param query {Object}
 * @param language {String}
 * @returns {Promise}
 */
const deleteDinosaur = (query, language) => {
	return new Promise((resolve, reject) => {
		dinosaursConstructor.deleteOne(query, err => {
			if (err) {
				return reject(utilityService.parseCodeMessage('database_error', language, err));
			}

			resolve();
		});
	});
};

/**
 * Saves an image in the database
 * @param data {Object}
 * @param language {String}
 * @returns {Promise}
 */
const saveImage = (data, language) => {
	return new Promise((resolve, reject) => {
		const newImage = new imagesConstructor(data);
		newImage.save(err => {
			if (err) {
				return reject(utilityService.parseCodeMessage('database_error', language, err));
			}

			resolve(newImage);
		})
	});
};

/**
 * Get an image by a query from the database
 * @param query {Object}
 * @param language {String}
 * @returns {Promise}
 */
const getImageByField = (query, language) => {
	return new Promise((resolve, reject) => {
		imagesConstructor.findOne(query, (err, image) => {
			if (err) {
				return reject(utilityService.parseCodeMessage('database_error', language, err));
			}

			return resolve(image);
		})
	})
};

/**
 * Updates an image from the database
 * @param query {Object}
 * @param operation {Object}
 * @param language {String}
 * @returns {Promise}
 */
const updateImage = (query, operation, language) => {
	return new Promise((resolve, reject) => {
		imagesConstructor.updateOne(query, operation, err => {
			if (err) {
				return reject(utilityService.parseCodeMessage('database_error', language, err));
			}

			resolve();
		});
	});
};

/**
 * Deletes an image from the database
 * @param query {Object}
 * @param language {String}
 * @returns {Promise}
 */
const deleteImage = (query, language) => {
	return new Promise((resolve, reject) => {
		imagesConstructor.deleteOne(query, err => {
			if (err) {
				return reject(utilityService.parseCodeMessage('database_error', language, err));
			}

			resolve();
		});
	});
};

/**
 * Deletes previous imported plates from the database
 * @param query {Object}
 * @param language {String}
 * @returns {Promise}
 */
const deletePreviousImportedPlates = (query, language) => {
	return new Promise((resolve, reject) => {
		importedPlatesConstructor.remove(query, err => {
			if (err) {
				return reject(utilityService.parseCodeMessage('database_error', language, err));
			}

			resolve();
		});
	});
};

/**
 * Deletes previous imported plates from the database
 * @param query {Object}
 * @param language {String}
 * @returns {Promise}
 */
 const deletePreviousImportedNoisyPlatingPlates = (query, language) => {
	return new Promise((resolve, reject) => {
		doubleStructurePlatesConstructor.remove(query, err => {
			if (err) {
				return reject(utilityService.parseCodeMessage('database_error', language, err));
			}

			resolve();
		});
	});
};

/**
 * Deletes previous imported plates from the database
 * @param query {Object}
 * @param language {String}
 * @returns {Promise}
 */
 const deletePreviousImportedSpecialWalls = (query, language) => {
	return new Promise((resolve, reject) => {
		doubleStructurePlatesConstructor.remove(query, err => {
			if (err) {
				return reject(utilityService.parseCodeMessage('database_error', language, err));
			}

			resolve();
		});
	});
};

/**
 * Deletes previous imported plates from the database
 * @param query {Object}
 * @param language {String}
 * @returns {Promise}
 */
 const deletePreviousImportedPlatingPlates = (query, language) => {
	return new Promise((resolve, reject) => {
		importedPlatingPlatesConstructor.remove(query, err => {
			if (err) {
				return reject(utilityService.parseCodeMessage('database_error', language, err));
			}

			resolve();
		});
	});
};

/**
 *
 * Deletes previous imported consumptions from the database
 * @param query {Object}
 * @param language {String}
 * @returns {Promise}
 */
const deletePreviousImportedConsumptions = (query, language) => {
	return new Promise((resolve, reject) => {
		importedConsumptionsConstructor.remove(query, err => {
			if (err) {
				return reject(utilityService.parseCodeMessage('database_error', language, err));
			}
			resolve();
		});
	});
};

const deleteArrayConsumptions = (query, language) => {
	return new Promise((resolve, reject) => {
		importedConsumptionsConstructor.deleteMany(query, err => {
			if (err) {
				return reject(utilityService.parseCodeMessage('database_error', language, err));
			}
			resolve();
		});
	});
};

const deletePreviousUploads = (query, language) => {
	return new Promise((resolve, reject) => {
		uploadsConstructor.deleteMany(query, err => {
			if (err) {
				return reject(utilityService.parseCodeMessage('database_error', language, err));
			}
			resolve();
		});
	});
};

const deleteOldUploads = (query, language) => {
	return new Promise((resolve, reject) => {
		uploadsConstructor.deleteMany(query, err => {
			if (err) {
				return reject(utilityService.parseCodeMessage('database_error', language, err));
			}
			resolve();
		});
	});
};

const deletePreviousCurrentOffer = (query, language) => {
	return new Promise((resolve, reject) => {
		currentOfferConstructor.remove(query, err => {
			if (err) {
				return reject(utilityService.parseCodeMessage('database_error', language, err));
			}

			resolve();
		});
	});
};

/**
 * Saves a offer in the database
 * @param data {Object}
 * @param language {String}
 * @returns {Promise}
 */
const saveOffer = (data, language) => {
	return new Promise((resolve, reject) => {
		const newOffer = new offerConstructor(data);
		newOffer.save(err => {
			if (err) {
				return reject(utilityService.parseCodeMessage('database_error', language, err));
			}

			resolve(newOffer);
		})
	});
};

/**
 * Saves a current offer in the database
 * @param data {Object}
 * @param language {String}
 * @returns {Promise}
 */
const saveCurrentOffer = (data, language) => {
	return new Promise((resolve, reject) => {
		const newOffer = new currentOfferConstructor(data);
		newOffer.save(err => {
			if (err) {
				return reject(utilityService.parseCodeMessage('database_error', language, err));
			}

			resolve(newOffer);
		})
	});
};

/**
 * Get offer by a query from the database
 * @param query {Object}
 * @param language {String}
 * @returns {Promise}
 */
const getOfferByField = (query, language) => {
	return new Promise((resolve, reject) => {
		offerConstructor.findOne(query, (err, offer) => {
			if (err) {
				return reject(utilityService.parseCodeMessage('database_error', language, err));
			}

			return resolve(offer);
		})
	})
}

/**
 * Get current offer from the database
 * @param query {Object}
 * @param language {String}
 * @returns {Promise}
 */
const getCurrentOffer = (query, language) => {
	return new Promise((resolve, reject) => {
		currentOfferConstructor.findOne(query, (err, offer) => {
			if (err) {
				return reject(utilityService.parseCodeMessage('database_error', language, err));
			}

			return resolve(offer);
		})
	})
}

/**
 * Deletes previous offers from the database
 * @param query {Object}
 * @param language {String}
 * @returns {Promise}
 */
const deletePreviousOffers = (query, language) => {
	return new Promise((resolve, reject) => {
		offerConstructor.remove(query, err => {
			if (err) {
				return reject(utilityService.parseCodeMessage('database_error', language, err));
			}

			resolve();
		});
	});
};

/**
 * Deletes saved offers from the database
 * @param query {Object}
 * @param language {String}
 * @returns {Promise}
 */
const deleteSavedOffers = (query, language) => {
	return new Promise((resolve, reject) => {
		savedOffersConstructor.remove(query, err => {
			if (err) {
				return reject(utilityService.parseCodeMessage('database_error', language, err));
			}

			resolve();
		});
	});
};

/**
 * Deletes draft offers from the database
 * @param query {Object}
 * @param language {String}
 * @returns {Promise}
 */
 const deleteDraftOffers = (query, language) => {
	return new Promise((resolve, reject) => {
		savedOffersConstructor.remove(query, err => {
			if (err) {
				return reject(utilityService.parseCodeMessage('database_error', language, err));
			}

			resolve();
		});
	});
};

/**
 * Get multiple offers by a query from the database
 * @param query {Object}
 * @param sort {Object}
 * @param limit {Object}
 * @param language {String}
 * @returns {Promise}
 */
const getOffersByField = (query, sort, limit, language) => {
	return new Promise((resolve, reject) => {
		offerConstructor.find(query)
			.exec((err, offers) => {
				if (err) {
					return reject(utilityService.parseCodeMessage('database_error', language, err));
				}
				return resolve(offers);
			});
	})
};

/**
 * Saves an allowed plate in the database
 * @param data
 * @param language
 * @returns {Promise}
 */
const saveImportedPlates = (data, language) => {
	return new Promise((resolve, reject) => {
		const importedPlates = new importedPlatesConstructor(data);
		importedPlates.save(err => {
			if (err) {
				return reject(utilityService.parseCodeMessage('database_error', language, err));
			}

			resolve(importedPlates);
		})
	});
};

/**
 * Saves an allowed plate in the database
 * @param data
 * @param language
 * @returns {Promise}
 */
 const saveImportedNoisyPlatingPlates = (data, language) => {
	return new Promise((resolve, reject) => {
		const importedPlates = new doubleStructurePlatesConstructor(data);
		importedPlates.save(err => {
			if (err) {
				return reject(utilityService.parseCodeMessage('database_error', language, err));
			}

			resolve(importedPlates);
		})
	});
};

/**
 * Saves an special walls in the database
 * @param data
 * @param language
 * @returns {Promise}
 */
 const saveImportedSpecialWalls = (data, language) => {
	return new Promise((resolve, reject) => {
		const importedPlates = new doubleStructurePlatesConstructor(data);
		importedPlates.save(err => {
			if (err) {
				console.log(err);
				return reject(utilityService.parseCodeMessage('database_error', language, err));
			}

			resolve(importedPlates);
		})
	});
};


/**
 * Saves an allowed plate in the database
 * @param data
 * @param language
 * @returns {Promise}
 */
 const saveImportedPlatingPlates = (data, language) => {
	return new Promise((resolve, reject) => {
		const importedPlates = new importedPlatingPlatesConstructor(data);
		importedPlates.save(err => {
			if (err) {
				return reject(utilityService.parseCodeMessage('database_error', language, err));
			}

			resolve(importedPlates);
		})
	});
};

/**
 * Saves conditions consumptions in the database
 * @param data
 * @param language
 * @returns {Promise}
 */
const saveImportedConsumptions = (data, language) => {
	return new Promise((resolve, reject) => {
		const importedConsumptions = new importedConsumptionsConstructor(data);
		importedConsumptions.save(err => {
			if (err) {
				return reject(utilityService.parseCodeMessage('database_error', language, err));
			}

			resolve(importedConsumptions);
		})
	});
};

const saveArrayConsumptions = (data, language) => {
	return new Promise((resolve, reject) => {
		importedConsumptionsConstructor.insertMany(data, (err, docs) => {
			if (err) return reject(utilityService.parseCodeMessage('database_error', language, err));
			resolve();
		});
	});
};

const saveToUploads = (data, language) => {
	return new Promise((resolve, reject) => {
		const uploads = new uploadsConstructor(data);
		uploads.save(err => {
			if (err) {
				return reject(utilityService.parseCodeMessage('database_error', language, err));
			}
			resolve(uploads);
		})
	});
};

/**
 *
 *
 * @param data
 * @param language
 * @returns {Promise}
 */
const saveAllowedPlates = (data, language) => {
	return new Promise((resolve, reject) => {
		const newAllowedPlate = new allowedPlatesConstructor(data);
		newAllowedPlate.save(err => {
			if (err) {
				return reject(utilityService.parseCodeMessage('database_error', language, err));
			}

			resolve(newAllowedPlate);
		})
	});
};

/**
 * Saves a product in the daatabse
 * @param data
 * @param language
 * @returns {Promise}
 */
const saveProduct = (data, language) => {
	return new Promise((resolve, reject) => {
		const newProduct = new productsConstructor(data);
		newProduct.save(err => {
			if (err) {
				return reject(utilityService.parseCodeMessage('database_error', language, err));
			}

			resolve(newProduct);
		})
	});
};

/**
 * Deletes previous allowed plates from the database
 * @param query
 * @param language
 * @returns {Promise}
 */
const deletePreviousAllowedPlates = (query, language) => {
	return new Promise((resolve, reject) => {
		allowedPlatesConstructor.remove(query, err => {
			if (err) {
				return reject(utilityService.parseCodeMessage('database_error', language, err));
			}
			resolve();
		});
	});
};

/**
 * Temporary route: to be used on the inital product import
 * Delete all products from DB
 * @param query
 * @param language
 * @returns {Promise}
 */
const deletePreviousProducts = (query, language) => {
	return new Promise((resolve, reject) => {
		productsConstructor.remove(query, err => {
			if (err) {
				return reject(utilityService.parseCodeMessage('database_error', language, err));
			}
			resolve();
		});
	});
};

const getAllowedPlatesByField = (query, sort, limit, language) => {
	return new Promise((resolve, reject) => {
		allowedPlatesConstructor.find()
			.exec((err, plates) => {
				if (err) {
					return reject(utilityService.parseCodeMessage('database_error', language, err));
				}
				return resolve(plates);
			});
	})
};

/**
 * Get all products from the database
 * @param query
 * @param sort
 * @param limit
 * @param language
 * @returns {Promise}
 */
const getProductsByField = (query, sort, limit, language) => {
	return new Promise((resolve, reject) => {
		productsConstructor.find(query)
			.exec((err, plates) => {
				if (err) {
					return reject(utilityService.parseCodeMessage('database_error', language, err));
				}
				return resolve(plates);
			});
	})
};

/**
 * Get all products from the database
 * @param query
 * @param sort
 * @param limit
 * @param language
 * @returns {Promise}
 */
const getImportedPlates = (query, sort, limit, language) => {
	return new Promise((resolve, reject) => {
		importedPlatesConstructor.aggregate([{ $match: query }])
			.exec((err, plates) => {
				if (err) {
					return reject(utilityService.parseCodeMessage('database_error', language, err));
				}
				return resolve(plates);
			});
	})
};

/**
 * Get all special walls from the database
 * @param query
 * @param sort
 * @param limit
 * @param language
 * @returns {Promise}
 */
 const getImportedSpecialWalls = (query, sort, limit, language) => {
	return new Promise((resolve, reject) => {
		doubleStructurePlatesConstructor.aggregate([{ $match: query }])
			.exec((err, plates) => {
				if (err) {
					return reject(utilityService.parseCodeMessage('database_error', language, err));
				}
				return resolve(plates);
			});
	})
};

/**
 * Get all thicknesses from special walls from the database
 * @param query
 * @param sort
 * @param limit
 * @param language
 * @returns {Promise}
 */
 const getThicknesses = (query, sort, limit, language) => {
	return new Promise((resolve, reject) => {
		systemCodesConstructor.aggregate([{ $match: query }])
			.exec((err, plates) => {
				if (err) {
					return reject(utilityService.parseCodeMessage('database_error', language, err));
				}
				return resolve(plates);
			});
	})
};

/**
 * Get all products from the database
 * @param query
 * @param sort
 * @param limit
 * @param language
 * @returns {Promise}
 */
 const getImportedNoisyPlatingSystems = (query, sort, limit, language) => {
	return new Promise((resolve, reject) => {
		doubleStructurePlatesConstructor.aggregate([{ $match: query }])
			.exec((err, plates) => {
				if (err) {
					return reject(utilityService.parseCodeMessage('database_error', language, err));
				}
				return resolve(plates);
			});
	})
};


/**
 * Get all products from the database
 * @param query
 * @param sort
 * @param limit
 * @param language
 * @returns {Promise}
 */
 const getImportedPlatingPlates = (query, sort, limit, language) => {
	return new Promise((resolve, reject) => {
		importedPlatingPlatesConstructor.aggregate([{ $match: query }])
			.exec((err, plates) => {
				if (err) {
					return reject(utilityService.parseCodeMessage('database_error', language, err));
				}
				return resolve(plates);
			});
	})
};

/**
 * Get all products from the database
 * @param query
 * @param sort
 * @param limit
 * @param language
 * @returns {Promise}
 */
const getImportedConsumptions = (query, sort, limit, language) => {
	return new Promise((resolve, reject) => {
		importedConsumptionsConstructor.aggregate([{ $match: query }])
			.exec((err, plates) => {
				if (err) {
					return reject(utilityService.parseCodeMessage('database_error', language, err));
				}
				return resolve(plates);
			});
	})
};

/**
 * Updates an dinosaur from the database
 * @param query {Object}
 * @param operation {Object}
 * @param language {String}
 * @returns {Promise}
 */
const updateConsumption = (query, operation, language) => {
	return new Promise((resolve, reject) => {
		importedConsumptionsConstructor.updateOne(query, operation, err => {
			if (err) {
				return reject(utilityService.parseCodeMessage('database_error', language, err));
			}

			resolve();
		});
	});
};

const getUploads = (query, sort, limit, language) => {
	return new Promise((resolve, reject) => {
		uploadsConstructor.find()
			.exec((err, uploads) => {
				if (err) {
					return reject(utilityService.parseCodeMessage('database_error', language, err));
				}
				return resolve(uploads);
			});
	})
};

/*
 * Saves a product in the daatabse
 * @param data
 * @param language
 * @returns {Promise}
 */
const saveSavedOffers = (data, language) => {
	return new Promise((resolve, reject) => {
		const newSavedOffer = new savedOffersConstructor(data);
		newSavedOffer.save(err => {
			if (err) {
				return reject(utilityService.parseCodeMessage('database_error', language, err));
			}

			resolve(newSavedOffer);
		})
	});
};

/**
 * Get multiple offers by a query from the database
 * @param query {Object}
 * @param sort {Object}
 * @param limit {Object}
 * @param language {String}
 * @returns {Promise}
 */
const getSavedOffersByFields = (query, sort, limit, language) => {
	return new Promise((resolve, reject) => {
		savedOffersConstructor.find(query)
			.exec((err, offers) => {
				if (err) {
					return reject(utilityService.parseCodeMessage('database_error', language, err));
				}
				return resolve(offers);
			});
	})
};

/**
 * Get multiple sessions by a query from the database
 * @param query {Object}
 * @param sort {Object}
 * @param limit {Object}
 * @param language {String}
 * @returns {Promise}
 */
const getSessionsByFields = (query, sort, limit, language) => {
	return new Promise((resolve, reject) => {
		sessionConstructor.find(query)
			.exec((err, sessions) => {
				if (err) {
					return reject(utilityService.parseCodeMessage('database_error', language, err));
				}
				return resolve(sessions);
			});
	})
};

/**
 * Get a session by a query from the database
 * @param query {Object}
 * @param sort {Object}
 * @param limit {Object}
 * @param language {String}
 * @returns {Promise}
 */
 const getSessionByFields = (query, sort, limit, language) => {
	return new Promise((resolve, reject) => {
		sessionConstructor.findOne(query)
			.exec((err, session) => {
				if (err) {
					return reject(utilityService.parseCodeMessage('database_error', language, err));
				}
				return resolve(session);
			});
	})
};

/**
 * Get multiple offers by a query from the database
 * @param query {Object}
 * @param sort {Object}
 * @param limit {Object}
 * @param language {String}
 * @returns {Promise}
 */
const getSavedOfferByFields = (query, sort, limit, language) => {
	return new Promise((resolve, reject) => {
		savedOffersConstructor.findOne(query)
			.exec((err, offer) => {
				if (err) {
					return reject(utilityService.parseCodeMessage('database_error', language, err));
				}
				return resolve(offer);
			});
	})
};

/**
 * Get session by a query from the database
 * @param query {Object}
 * @param sort {Object}
 * @param limit {Object}
 * @param language {String}
 * @returns {Promise}
 */
 const getSavedSessionByFields = (query, sort, limit, language) => {
	return new Promise((resolve, reject) => {
		sessionConstructor.findOne(query)
			.exec((err, offer) => {
				if (err) {
					return reject(utilityService.parseCodeMessage('database_error', language, err));
				}
				return resolve(offer);
			});
	})
};

/**
 * Get offer by a query from the database
 * @param query {Object}
 * @param sort {Object}
 * @param limit {Object}
 * @param language {String}
 * @returns {Promise}
 */
const getOfferByFields = (query, sort, limit, language) => {
	return new Promise((resolve, reject) => {
		offerConstructor.findOne(query)
			.exec((err, offer) => {
				if (err) {
					return reject(utilityService.parseCodeMessage('database_error', language, err));
				}
				return resolve(offer);
			});
	})
};

/**
 * Updates an saved offer from the database
 * @param query {Object}
 * @param operation {Object}
 * @param language {String}
 * @returns {Promise}
 */
const updateSavedOffer = (query, operation, language) => {
	return new Promise((resolve, reject) => {
		savedOffersConstructor.updateOne(query, operation, err => {
			if (err) {
				return reject(utilityService.parseCodeMessage('database_error', language, err));
			}

			resolve();
		});
	});
};

/**
 * Updates an offer from the database
 * @param query {Object}
 * @param operation {Object}
 * @param language {String}
 * @returns {Promise}
 */
const updateOffer = (query, operation, language) => {
	return new Promise((resolve, reject) => {
		offerConstructor.updateOne(query, operation, err => {
			if (err) {
				return reject(utilityService.parseCodeMessage('database_error', language, err));
			}

			resolve();
		});
	});
};

/**
 * Deletes a saved offer from the database
 * @param query {Object}
 * @param language {String}
 * @returns {Promise}
 */
const deleteSavedOffer = (query, language) => {
	return new Promise((resolve, reject) => {
		savedOffersConstructor.deleteOne(query, err => {
			if (err) {
				return reject(utilityService.parseCodeMessage('database_error', language, err));
			}

			resolve();
		});
	});
};

/**
 * Deletes a session from the database
 * @param query {Object}
 * @param language {String}
 * @returns {Promise}
 */
 const deleteSession = (query, language) => {
	return new Promise((resolve, reject) => {
		sessionConstructor.deleteOne(query, err => {
			if (err) {
				return reject(utilityService.parseCodeMessage('database_error', language, err));
			}

			resolve();
		});
	});
};

/**
 * Saves a user in the database
 * @param data {Object}
 * @param language {String}
 * @returns {Promise}
 */
const saveSession = (data, language) => {
	return new Promise((resolve, reject) => {
		const newSession = new sessionConstructor(data);
		newSession.save(err => {
			if (err) {
				return reject(utilityService.parseCodeMessage('database_error', language, err));
			}
			resolve(newSession);
		})
	});
};

/**
 * Saves a user in the database
 * @param data {Object}
 * @param language {String}
 * @returns {Promise}
 */
 const updateSession = (query, operation, language) => {
	return new Promise((resolve, reject) => {
		sessionConstructor.updateOne(query, operation, err => {
			if (err) {
				return reject(utilityService.parseCodeMessage('database_error', language, err));
			}

			resolve();
		});
	});
};

/**
 * Get system code by a query from the database
 * @param query {Object}
 * @param sort {Object}
 * @param limit {Object}
 * @param language {String}
 * @returns {Promise}
 */
const getSystemCode = (query, sort, limit, language) => {
	return new Promise((resolve, reject) => {
		let stages = [
			{ $match: query },
		];
		if (sort) {
			stages = [...stages, sort];
		}
		if (limit) {
			stages = [...stages, limit];
		}

		systemCodesConstructor.aggregate(stages)
			.exec((err, systemCodes) => {
				if (err) {
					return reject(utilityService.parseCodeMessage('database_error', language, err));
				}
				if(systemCodes) {
					return resolve(systemCodes);
				}
				else {
					return reject(utilityService.parseCodeMessage('no_system', language, err));
				}
			});
	})
};

/**
 * Saves all system codes with sound isolation and the value of it in the database
 * @param data
 * @param language
 * @returns {Promise}
 */
 const saveAllSystemCodes = (data, language) => {
	return new Promise((resolve, reject) => {
		systemCodesConstructor.insertMany(data, (err => {
			if (err) {
				return reject(utilityService.parseCodeMessage('database_error', language, err));
			}

			resolve(data);
		}))
	});
};

/**
 * Saves system code with sound isolation and the value of it in the database
 * @param data
 * @param language
 * @returns {Promise}
 */
const saveSystemCode = (data, language) => {
	return new Promise((resolve, reject) => {
		const importedSystemCodes = new systemCodesConstructor(data);
		importedSystemCodes.save(err => {
			if (err) {
				return reject(utilityService.parseCodeMessage('database_error', language, err));
			}

			resolve(importedSystemCodes);
		})
	});
};

const deletePreviousSystemCodes = (query, language) => {
	return new Promise((resolve, reject) => {
		systemCodesConstructor.deleteMany(query, err => {
			if (err) {
				return reject(utilityService.parseCodeMessage('database_error', language, err));
			}
			resolve();
		});
	});
};

module.exports = {
	saveUser,
	getUsersByField,
	getUsersByFieldNotFancy,
	getUserByField,
	updateUser,
	deleteUser,
	saveDinosaur,
	getDinosaurByField,
	getDinosaursByField,
	updateDinosaur,
	deleteDinosaur,
	saveImage,
	getImageByField,
	updateImage,
	deleteImage,
	saveOffer,
	saveCurrentOffer,
	getOfferByField,
	deletePreviousOffers,
	getOffersByField,
	saveAllowedPlates,
	deletePreviousAllowedPlates,
	getAllowedPlatesByField,
	deletePreviousProducts,
	saveProduct,
	getProductsByField,
	saveImportedPlates,
	deletePreviousImportedPlates,
	getImportedPlates,
	getCurrentOffer,
	deletePreviousCurrentOffer,
	saveSavedOffers,
	getSavedOffersByFields,
	updateSavedOffer,
	getSavedOfferByFields,
	deletePreviousImportedConsumptions,
	getImportedConsumptions,
	updateConsumption,
	deleteSavedOffer,
	saveImportedConsumptions,
	deletePreviousUploads,
	saveToUploads,
	getUploads,
	updateOffer,
	getOfferByFields,
	saveSession,
	getSessionsByFields,
	deleteSavedOffers,
	saveSystemCode,
	saveAllSystemCodes,
	getSystemCode,
	deletePreviousSystemCodes,
	saveImportedPlatingPlates,
	deletePreviousImportedPlatingPlates,
	getImportedPlatingPlates,
	deleteDraftOffers,
	updateSession,
	getSavedSessionByFields,
	getSessionByFields,
	deleteSession,
	saveImportedNoisyPlatingPlates,
	deletePreviousImportedNoisyPlatingPlates,
	getImportedNoisyPlatingSystems,
	deletePreviousImportedSpecialWalls, 
	saveImportedSpecialWalls,
	getImportedSpecialWalls,
	getThicknesses,
	saveArrayConsumptions,
	deleteArrayConsumptions,
	deleteOldUploads
};
