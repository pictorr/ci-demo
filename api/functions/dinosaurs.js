const databaseService = require('../../utils/databaseService/databaseService.js');
const utilityService = require('../../utils/utilityService.js');
const { desc } = require('../../utils/constants.js');

/**
 * Get all dinosaurs from the database
 * @param language {String}
 * @returns {Promise}
 */
const getDinosaurs = language => {
	return new Promise((resolve, reject) => {
		return databaseService.getDinosaursByField({}, { $sort: { createdOn: desc } }, null, language)
			.then(dinosaurs => {
				return resolve({
					dinosaurs: dinosaurs.map(dinosaur => ( {
						id: dinosaur._id,
						species: dinosaur.species,
						foodPreference: dinosaur.foodPreference,
						wikipediaPage: dinosaur.wikipediaPage,
						averageSize: dinosaur.averageSize,
					} ))
				})
			})
			.catch(err => reject(err));
	});
};

/**
 * Saves a dinosaur in the database
 * @param req {Object} - Required for image upload
 * @param data {Object}
 * @param language {String}
 * @returns {Promise}
 */
const saveDinosaur = (req, data, language) => {
	return new Promise((resolve, reject) => {
		return databaseService.getDinosaurByField({
			$or: [{
				species: {
					$regex: data.species,
					$options: 'i'
				}
			}, {
				wikipediaPage: data.wikipediaPage
			}]
		}, language)
			.then(dinosaur => {
				if (dinosaur) {
					return reject(utilityService.parseCodeMessage('dinosaur_already_added', language));
				} else {
					return utilityService.upload('dinosaurImage', req, ['small', 'medium', 'original'], 'image')
						.then(uploadResults => {
							let promises = [];

							uploadResults.forEach(uploadedImage => {
								const imageData = {
									url: uploadedImage.file,
									variant: uploadedImage.variant,
								};
								promises.push(databaseService.saveImage(imageData, language));
							});

							return Promise.all(promises)
								.then(savedImages => {
									const dinosaurData = {
										species: data.species,
										foodPreference: data.foodPreference,
										wikipediaPage: data.wikipediaPage,
										averageSize: data.averageSize,
										image: {
											small: ( savedImages.find(image => image.variant === 'small') || {} )._id,
											medium: ( savedImages.find(image => image.variant === 'medium') || {} )._id,
											original: ( savedImages.find(image => image.variant === 'original') || {} )._id,
										}
									};

									return databaseService.saveDinosaur(dinosaurData, language);
								})
								.then(() => resolve());
						})
				}
			})
			.catch(err => reject(err));
	});
};

/**
 * Get a dinosaur from the database
 * @param dinosaurId {String}
 * @param language {String}
 * @returns {Promise}
 */
const getDinosaur = (dinosaurId, language) => {
	return new Promise((resolve, reject) => {
		return databaseService.getDinosaurByField({ _id: utilityService.castToObjectId(dinosaurId) }, language)
			.then(dinosaur => resolve({
				dinosaur: {
					id: dinosaur._id,
					species: dinosaur.species,
					foodPreference: dinosaur.foodPreference,
					wikipediaPage: dinosaur.wikipediaPage,
					averageSize: dinosaur.averageSize,
					image: utilityService.transformImageUrlToAccessibleUrl(dinosaur.imageOriginal.url),
				}
			}))
			.catch(err => reject(err));
	});
};

/**
 * Updates a dinosaur
 * @param req {Object}
 * @param data {Object}
 * @param language {String}
 * @returns {Promise}
 */
const updateDinosaur = (req, data, language) => {
	return new Promise((resolve, reject) => {
		let shouldRemoveOldImages = false;
		return databaseService.getDinosaurByField({
			_id: utilityService.castToObjectId(data.id)
		}, language)
			.then(dinosaur => {
				if (!dinosaur) {
					return reject(utilityService.parseCodeMessage('dinosaur_does_not_exist_update', language));
				} else {
					return databaseService.getDinosaurByField({
						$or: [{
							species: {
								$regex: data.species,
								$options: 'i'
							}
						}, {
							wikipediaPage: data.wikipediaPage
						}]
					}, language)
						.then(existingDinosaur => {
							if (existingDinosaur && !utilityService.compareIds(dinosaur._id, existingDinosaur._id)) {
								return reject(utilityService.parseCodeMessage('dinosaur_duplicate', language));
							} else {
								return utilityService.upload('dinosaurImage', req, ['small', 'medium', 'original'], 'image')
									.then(uploadResults => {
										let promises = [];
										shouldRemoveOldImages = !!uploadResults.length;

										uploadResults.forEach(uploadedImage => {
											const imageData = {
												url: uploadedImage.file,
												variant: uploadedImage.variant,
											};
											promises.push(databaseService.saveImage(imageData, language));
										});

										return Promise.all(promises)
											.then(savedImages => {
												const dinosaurData = {
													species: data.species,
													foodPreference: data.foodPreference,
													wikipediaPage: data.wikipediaPage,
													averageSize: data.averageSize,
													image: {
														small: ( savedImages.find(image => image.variant === 'small') || {} )._id,
														medium: ( savedImages.find(image => image.variant === 'medium') || {} )._id,
														original: ( savedImages.find(image => image.variant === 'original') || {} )._id,
													}
												};

												if (!shouldRemoveOldImages) {
													delete dinosaurData.image;
												}

												return databaseService.updateDinosaur({ _id: dinosaur._id }, dinosaurData, language);
											})
											.then(() => resolve())
											.then(() => {
												if (shouldRemoveOldImages) {
													// Remove previously saved images
													Object.keys(dinosaur.image).forEach(key => {
														databaseService.getImageByField({ _id: dinosaur.image[key] }, language)
															.then(image => utilityService.deleteFileOnPod(image.url))
													})
												}
											})
									})
							}
						})
				}
			})
			.catch(err => reject(err));
	})
};

/**
 * Delete a dinosaur from the database
 * @param dinosaurId {String}
 * @param language {String}
 * @returns {Promise}
 */
const deleteDinosaur = (dinosaurId, language) => {
	return new Promise((resolve, reject) => {
		return databaseService.getDinosaurByField({ _id: utilityService.castToObjectId(dinosaurId) }, language)
			.then(dinosaur => {
				if (!dinosaur) {
					return reject(utilityService.parseCodeMessage('dinosaur_does_not_exist_delete', language));
				} else {
					return databaseService.deleteDinosaur({ _id: dinosaur._id }, language)
						.then(() => resolve())
						.then(() => {
							// Do this after resolving
							Object.keys(dinosaur.image).forEach(key => {
								databaseService.getImageByField({ _id: dinosaur.image[key] }, language)
									.then(image => utilityService.deleteFileOnPod(image.url))
							});
						});
				}
			})
			.catch(err => reject(err))
	});
};

module.exports = {
	getDinosaurs,
	saveDinosaur,
	getDinosaur,
	updateDinosaur,
	deleteDinosaur,
};